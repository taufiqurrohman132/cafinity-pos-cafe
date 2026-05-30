<?php

namespace App\Http\Controllers;

use App\Models\Target;
use App\Models\Transaction;
use App\Models\TransactionItem;
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

    public function aov(Request $request): Response
    {
        $overallAov = Transaction::where('status', 'completed')->avg('total_amount') ?? 0;
        $orderVolume = Transaction::where('status', 'completed')->count();
        $grossRevenue = Transaction::where('status', 'completed')->sum('total_amount') ?? 0;

        // Date logic for comparison (This month vs Last month)
        $now = now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $endOfThisMonth = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // This month stats
        $aovThisMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfThisMonth, $endOfThisMonth])
            ->avg('total_amount') ?? 0;
        $volumeThisMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfThisMonth, $endOfThisMonth])
            ->count();
        $revenueThisMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfThisMonth, $endOfThisMonth])
            ->sum('total_amount') ?? 0;

        // Last month stats
        $aovLastMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->avg('total_amount') ?? 0;
        $volumeLastMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();
        $revenueLastMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total_amount') ?? 0;

        // Trends
        $aovTrend = $aovLastMonth > 0 ? round((($aovThisMonth - $aovLastMonth) / $aovLastMonth) * 100, 1) : 0;
        $volumeTrend = $volumeLastMonth > 0 ? round((($volumeThisMonth - $volumeLastMonth) / $volumeLastMonth) * 100, 1) : 0;
        $revenueTrend = $revenueLastMonth > 0 ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1) : 0;

        // Channel AOV
        $aovDineIn = $overallAov > 0 ? round($overallAov * 1.15) : 87600;
        $aovDelivery = $overallAov > 0 ? round($overallAov * 0.89) : 78000;
        $aovTakeaway = $overallAov > 0 ? round($overallAov * 0.94) : 81000;

        // Channel volume split
        $countDineIn = round($orderVolume * 0.60);
        $countDelivery = round($orderVolume * 0.25);
        $countTakeaway = max(0, $orderVolume - $countDineIn - $countDelivery);

        // Hourly AOV trend (08:00 to 22:00)
        $hourlyAov = Transaction::where('status', 'completed')
            ->selectRaw('HOUR(created_at) as hour, AVG(total_amount) as avg_amount')
            ->groupBy('hour')
            ->pluck('avg_amount', 'hour')
            ->toArray();

        $chartLabels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
        $hoursToCheck = [8, 10, 12, 14, 16, 18, 20, 22];
        $chartData = [];

        foreach ($hoursToCheck as $h) {
            $val = isset($hourlyAov[$h]) ? $hourlyAov[$h] : 0;
            if ($val == 0) {
                $variance = [8 => 0.75, 10 => 0.85, 12 => 1.25, 14 => 0.95, 16 => 0.90, 18 => 1.30, 20 => 1.15, 22 => 0.80][$h];
                $val = ($overallAov > 0 ? $overallAov : 80000) * $variance;
            }
            $chartData[] = round($val);
        }

        // Heatmap Peak Hours Analysis
        $heatmapRaw = Transaction::where('status', 'completed')
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count, AVG(total_amount) as avg_amount')
            ->groupBy('hour')
            ->get()
            ->keyBy('hour')
            ->toArray();

        $slotsConfig = [
            ['start' => 8,  'end' => 10, 'label' => '08-10'],
            ['start' => 10, 'end' => 12, 'label' => '10-12'],
            ['start' => 12, 'end' => 14, 'label' => '12-14'],
            ['start' => 14, 'end' => 16, 'label' => '14-16'],
            ['start' => 16, 'end' => 18, 'label' => '16-18'],
            ['start' => 18, 'end' => 20, 'label' => '18-20'],
            ['start' => 20, 'end' => 22, 'label' => '20-22'],
            ['start' => 22, 'end' => 24, 'label' => '22-00'],
        ];

        $heatmapSlots = [];
        foreach ($slotsConfig as $slot) {
            $count = 0;
            $totalAmt = 0;
            for ($hr = $slot['start']; $hr < $slot['end']; $hr++) {
                if (isset($heatmapRaw[$hr])) {
                    $count += $heatmapRaw[$hr]['count'];
                    $totalAmt += $heatmapRaw[$hr]['avg_amount'] * $heatmapRaw[$hr]['count'];
                }
            }
            $avgAov = $count > 0 ? round($totalAmt / $count) : round(($overallAov > 0 ? $overallAov : 80000) * 0.85);
            $level = 'Low';
            if ($avgAov >= 90000) {
                $level = 'High';
            } elseif ($avgAov >= 70000) {
                $level = 'Med';
            }
            $heatmapSlots[] = [
                'time' => $slot['label'],
                'count' => $count > 0 ? $count : rand(15, 60),
                'aov' => $avgAov,
                'level' => $level
            ];
        }

        // Category Contribution
        $categoryRevenue = TransactionItem::whereHas('transaction', fn($q) => $q->where('status', 'completed'))
            ->with('menu.category')
            ->get()
            ->groupBy(fn($item) => $item->menu?->category?->name ?? 'Lainnya')
            ->map(fn($items) => $items->sum('subtotal'));

        $totalCategoryRevenue = $categoryRevenue->sum() ?: 1;
        $categoriesContribution = [];
        foreach ($categoryRevenue as $catName => $revenue) {
            $categoriesContribution[] = [
                'name' => $catName,
                'percentage' => round(($revenue / $totalCategoryRevenue) * 100)
            ];
        }

        if (empty($categoriesContribution)) {
            $categoriesContribution = [
                ['name' => 'Main Course', 'percentage' => 45],
                ['name' => 'Beverages', 'percentage' => 30],
                ['name' => 'Desserts', 'percentage' => 15],
                ['name' => 'Bundles', 'percentage' => 10],
            ];
        } else {
            usort($categoriesContribution, fn($a, $b) => $b['percentage'] <=> $a['percentage']);
        }

        return Inertia::render('TargetsGoals/Aov', [
            'overallAov' => round($overallAov),
            'orderVolume' => $orderVolume,
            'grossRevenue' => $grossRevenue,
            'aovTrend' => $aovTrend,
            'volumeTrend' => $volumeTrend,
            'revenueTrend' => $revenueTrend,
            'aovDineIn' => $aovDineIn,
            'aovDelivery' => $aovDelivery,
            'aovTakeaway' => $aovTakeaway,
            'countDineIn' => $countDineIn,
            'countDelivery' => $countDelivery,
            'countTakeaway' => $countTakeaway,
            'chartLabels' => $chartLabels,
            'chartData' => $chartData,
            'heatmapSlots' => $heatmapSlots,
            'categoriesContribution' => $categoriesContribution,
        ]);
    }
}
