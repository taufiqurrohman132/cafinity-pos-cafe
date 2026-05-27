<?php

namespace App\Http\Controllers;

use App\Models\Target;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class TargetController extends Controller
{
    
    public function index(Request $request): Response // Ubah return type
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

        // (Semua query dan logika $target, $currentValue, $progress, dll. TETAP SAMA seperti aslinya)
        // ... (sisipan logika query yang ada sebelumnya di sini) ...

        // UBAH BAGIAN RETURN INI:
        return Inertia::render('TargetsGoals/Index', [
            'target'           => $target,
            'targetValue'      => $targetValue,
            'currentValue'     => $currentValue,
            'progress'         => $progress,
            'remaining'        => $remaining,
            'lastUpdated'      => $lastUpdated,
            'period'           => $period,
            'estimasi'         => $estimasi,
            'trendEstimasi'    => $trendEstimasi,
            'avgHarian'        => $avgHarian,
            'history'          => $history,
            'staffPerformance' => $staffPerformance,
            'maxStaff'         => $maxStaff,
            'paymentSummary'   => $paymentSummary,
            'peakLabel'        => $peakLabel,
            'promoAktif'       => $promoAktif,
        ]);
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
