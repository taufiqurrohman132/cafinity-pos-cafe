<?php

namespace App\Http\Controllers;

use App\Models\Target;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class TargetController extends Controller
{
    
    public function index(Request $request): View
    {
        $today  = today();
        $period = $request->get('period', 'harian');

        // Mapping filter ke period di database
        $periodMap = [
            'harian'   => 'daily',
            'mingguan' => 'weekly',
            'bulanan'  => 'monthly',
        ];

        $dbPeriod = $periodMap[$period] ?? 'daily';

        // Range tanggal sesuai filter
        [$startDate, $endDate] = match ($dbPeriod) {
            'weekly'  => [today()->startOfWeek(), today()->endOfWeek()],
            'monthly' => [today()->startOfMonth(), today()->endOfMonth()],
            default   => [$today->copy(), $today->copy()],
        };

        // Target aktif
        $target = Target::query()
            ->where('type', 'revenue')
            ->where('period', $dbPeriod)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->first();

        // Revenue sesuai filter
        $currentRevenue = (int) Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                $startDate->copy()->startOfDay(),
                $endDate->copy()->endOfDay(),
            ])
            ->sum('total_amount');

        $targetValue = $target?->target_value ?? 0;

        $currentValue = $target
            ? max($target->current_value, $currentRevenue)
            : $currentRevenue;

        $progress = $targetValue > 0
            ? min(100, round(($currentValue / $targetValue) * 100, 1))
            : 0;

        $remaining   = max(0, $targetValue - $currentValue);
        $lastUpdated = now()->diffForHumans(short: false);
        $avgHarian   = $this->avgDailyRevenue(30);

        $hoursElapsed = max(
            1,
            now()->diffInHours(
                $startDate->copy()->setTime(8, 0)
            )
        );

        $estimasi = (int) round(
            ($currentValue / $hoursElapsed) * 14
        );

        $trendEstimasi = $targetValue > 0
            ? round((($estimasi - $targetValue) / $targetValue) * 100, 1)
            : 0;

        $history = $this->buildHistory(30);

        // Top staff
        $staffPerformance = Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                $startDate->copy()->startOfDay(),
                $endDate->copy()->endOfDay(),
            ])
            ->whereNotNull('cashier_id')
            ->select(
                'cashier_id',
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('cashier_id')
            ->orderByDesc('total')
            ->limit(3)
            ->with('cashier')
            ->get()
            ->map(fn($row) => [
                'name'  => $row->cashier?->name ?? 'Staf',
                'role'  => $row->cashier?->role ?? '',
                'total' => (int) $row->total,
            ]);

        $maxStaff = $staffPerformance->max('total') ?: 1;

        // Metode pembayaran
        $paymentMethods = Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                $startDate->copy()->startOfDay(),
                $endDate->copy()->endOfDay(),
            ])
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('payment_method')
            ->orderByDesc('total')
            ->pluck('total', 'payment_method');

        $totalTrx = $paymentMethods->sum() ?: 1;

        $paymentSummary = $paymentMethods->map(
            fn($count, $method) =>
            strtoupper($method) .
                ' (' .
                round(($count / $totalTrx) * 100) .
                '%)'
        )->implode(', ');

        // Jam tersibuk 7 hari terakhir
        $peakHour = Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [
                now()->subDays(7),
                now(),
            ])
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('hour')
            ->orderByDesc('total')
            ->first();

        $peakLabel = $peakHour
            ? sprintf(
                '%02d:00 - %02d:00',
                $peakHour->hour,
                $peakHour->hour + 2
            )
            : '12:00 - 14:00';

        $promoAktif = '-';

        return view('shared.targets-goals.index', compact(
            'target',
            'targetValue',
            'currentValue',
            'progress',
            'remaining',
            'lastUpdated',
            'period',
            'estimasi',
            'trendEstimasi',
            'avgHarian',
            'history',
            'staffPerformance',
            'maxStaff',
            'paymentSummary',
            'peakLabel',
            'promoAktif',
            'today'
        ));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label'         => 'nullable|string|max:100',  // ← nullable
            'type'          => 'required|in:revenue,orders,profit',
            'period'        => 'required|in:daily,weekly,monthly',
            'target_value'  => 'required|integer|min:1',
            'current_value' => 'nullable|integer|min:0',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
        ]);

        $data['label']         = $data['label'] ?: 'Target Umum';  // ← default
        $data['current_value'] = $data['current_value'] ?? 0;

        $existing = Target::query()
            ->where('type', $data['type'])
            ->where('period', $data['period'])
            ->whereDate('start_date', $data['start_date'])
            ->first();

        $existing ? $existing->update($data) : Target::create($data);

        return back()->with('target_saved', $data['label']);  // ← satu return, tanpa dd()
    }

    public function update(Request $request, string $id)
    {
        Target::findOrFail($id)->update($request->validate([
            'label'         => 'required|string|max:100',
            'type'          => 'required|in:revenue,orders,profit',
            'period'        => 'required|in:daily,weekly,monthly',
            'target_value'  => 'required|integer|min:1',
            'current_value' => 'nullable|integer|min:0',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
        ]));

        return back()->with('success', 'Target berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        Target::findOrFail($id)->delete();

        return back()->with('success', 'Target dihapus.');
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private function avgDailyRevenue(int $days): int
    {
        $result = Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [today()->subDays($days), today()])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('date')
            ->get();

        return $result->count() > 0 ? (int) round($result->avg('total')) : 0;
    }

    private function buildHistory(int $days): array
    {
        $revenues = Transaction::query()
            ->where('status', 'completed')
            ->whereBetween('created_at', [today()->subDays($days - 1), now()])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date');

        $target = Target::query()
            ->where('type', 'revenue')
            ->where('period', 'daily')
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today()->subDays($days))
            ->orderByDesc('start_date')
            ->first();

        $targetValue = $target?->target_value ?? 0;
        $labels = $actuals = $targets = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date      = today()->subDays($i);
            $labels[]  = $date->format('d M');
            $actuals[] = (int) ($revenues[$date->toDateString()] ?? 0);
            $targets[] = $targetValue;
        }

        return compact('labels', 'actuals', 'targets');
    }
}
