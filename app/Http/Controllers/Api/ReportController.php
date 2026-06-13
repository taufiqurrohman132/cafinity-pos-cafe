<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Target;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->get('days', 7);
        AuditLog::record('report.viewed', null, ['report' => 'index', 'days' => $days]);

        $startDate = $request->get('start_date') ? now()->parse($request->get('start_date'))->startOfDay() : now()->subDays($days - 1)->startOfDay();
        $endDate = $request->get('end_date') ? now()->parse($request->get('end_date'))->endOfDay() : now()->endOfDay();
        $kasirId = $request->get('kasir_id');
        $kategoriId = $request->get('kategori_id');
        $paymentMethod = $request->get('payment_method');

        $baseQuery = fn() => Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($kasirId,       fn($q) => $q->where('cashier_id', $kasirId))
            ->when($paymentMethod, fn($q) => $q->where('payment_method', $paymentMethod))
            ->when($kategoriId,    fn($q) => $q->whereHas('items.menu', fn($q2) => $q2->where('category_id', $kategoriId)));

        $totalRevenue   = (int) $baseQuery()->sum('total_amount');
        $totalOrders    = $baseQuery()->count();
        $avgTransaction = $totalOrders > 0 ? round($totalRevenue / $totalOrders) : 0;
        $totalProfit    = round($totalRevenue * 0.3);

        $prevRevenue = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [now()->subDays($days * 2), now()->subDays($days)])
            ->sum('total_amount');

        $revenueTrend = $prevRevenue > 0
            ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : 0;

        $revenueTrendType = $revenueTrend >= 0 ? 'up' : 'down';

        $bestMenus = TransactionItem::selectRaw('menu_id, SUM(qty) as total_qty, SUM(subtotal) as total_revenue')
            ->whereHas(
                'transaction',
                fn($q) => $q
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->when($kasirId,       fn($q) => $q->where('cashier_id', $kasirId))
                    ->when($paymentMethod, fn($q) => $q->where('payment_method', $paymentMethod))
            )
            ->when($kategoriId, fn($q) => $q->whereHas('menu', fn($q2) => $q2->where('category_id', $kategoriId)))
            ->groupBy('menu_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->with('menu.category', 'menu.recipe')
            ->get()
            ->map(function ($item) {
                $menu   = $item->menu;
                $recipe = $menu?->recipe;
                $hpp    = $recipe?->total_hpp ?? 0;
                $price  = $menu?->price ?? 0;
                $margin = $price > 0 ? round((($price - $hpp) / $price) * 100) : 0;

                return [
                    'name'     => $menu?->name ?? '-',
                    'category' => $menu?->category?->name ?? '-',
                    'qty'      => (int) $item->total_qty,
                    'revenue'  => (int) $item->total_revenue,
                    'margin'   => $margin,
                ];
            });

        $revenueChart = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($kasirId,       fn($q) => $q->where('cashier_id', $kasirId))
            ->when($paymentMethod, fn($q) => $q->where('payment_method', $paymentMethod))
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // HPP chart menggunakan DB aggregate sum untuk performa optimal
        $hppChart = DB::table('transaction_items')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('menus', 'transaction_items.menu_id', '=', 'menus.id')
            ->leftJoin('recipes', 'menus.id', '=', 'recipes.menu_id')
            ->where('transactions.status', 'completed')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->selectRaw('DATE(transactions.created_at) as date, SUM(COALESCE(recipes.total_hpp, 0) * transaction_items.qty) as total_hpp')
            ->groupBy('date')
            ->pluck('total_hpp', 'date');

        // Build chart labels — hitung dari selisih hari
        $diffDays = (int) $startDate->diffInDays($endDate) + 1;
        $chartLabels = $chartRevenue = $chartProfit = [];
        for ($i = $diffDays - 1; $i >= 0; $i--) {
            $date           = $endDate->copy()->subDays($i)->toDateString();
            $rev            = (int) ($revenueChart[$date]->revenue ?? 0);
            $hpp            = (int) ($hppChart[$date] ?? 0);
            $chartLabels[]  = $endDate->copy()->subDays($i)->translatedFormat('d M');
            $chartRevenue[] = $rev;
            $chartProfit[]  = max(0, $rev - $hpp);
        }

        $prevStart = now()->subDays($days * 2);
        $prevEnd   = now()->subDays($days);

        $prevOrders = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $prevAvgTransaction = $prevOrders > 0
            ? round(Transaction::where('status', 'completed')
                ->whereBetween('created_at', [$prevStart, $prevEnd])
                ->sum('total_amount') / $prevOrders)
            : 0;

        $prevProfit = round(Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum('total_amount') * 0.3);

        $ordersTrend = $prevOrders > 0
            ? round((($totalOrders - $prevOrders) / $prevOrders) * 100, 1)
            : 0;

        $avgTrend = $prevAvgTransaction > 0
            ? round((($avgTransaction - $prevAvgTransaction) / $prevAvgTransaction) * 100, 1)
            : 0;

        $profitTrend = $prevProfit > 0
            ? round((($totalProfit - $prevProfit) / $prevProfit) * 100, 1)
            : 0;

        $ordersTrendType = $ordersTrend >= 0 ? 'up' : 'down';
        $avgTrendType    = $avgTrend    >= 0 ? 'up' : 'down';
        $profitTrendType = $profitTrend >= 0 ? 'up' : 'down';

        // Donut chart komposisi penjualan per kategori
        $donutRaw = TransactionItem::whereHas(
            'transaction',
            fn($q) => $q
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->when($kasirId,       fn($q) => $q->where('cashier_id', $kasirId))
                ->when($paymentMethod, fn($q) => $q->where('payment_method', $paymentMethod))
        )
            ->when($kategoriId, fn($q) => $q->whereHas('menu', fn($q2) => $q2->where('category_id', $kategoriId)))
            ->with('menu.category')
            ->get()
            ->groupBy(fn($item) => $item->menu?->category?->name ?? 'Lainnya')
            ->map(fn($items) => $items->sum('subtotal'));

        $donutTotal  = $donutRaw->sum() ?: 1;
        $donutLabels = $donutRaw->keys()->values()->toArray();
        $donutData   = $donutRaw->map(fn($val) => round(($val / $donutTotal) * 100, 1))->values()->toArray();

        $donutColors = ['#443dff', '#34d399', '#f87171', '#fbbf24', '#a78bfa', '#38bdf8', '#fb923c'];
        $donutBg     = collect($donutLabels)->keys()->map(fn($i) => $donutColors[$i % count($donutColors)])->toArray();

        // Jam sibuk dari DB
        $busyRaw = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($kasirId,       fn($q) => $q->where('cashier_id', $kasirId))
            ->when($paymentMethod, fn($q) => $q->where('payment_method', $paymentMethod))
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as total')
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('total', 'hour');

        $operationalHours = [8, 10, 12, 14, 16, 18, 20];
        $maxBusy = $busyRaw->max() ?: 1;

        $busySlots = collect($operationalHours)->map(fn($hour) => [
            'label'  => sprintf('%02d:00', $hour),
            'count'  => (int) ($busyRaw[$hour] ?? 0),
            'height' => round((($busyRaw[$hour] ?? 0) / $maxBusy) * 100),
        ])->toArray();

        $monthlyTarget = Target::query()
            ->where('type', 'revenue')
            ->where('period', 'monthly')
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->first();

        $targetRevenue  = $monthlyTarget?->target_value ?? 0;
        $currentRevenue = (int) Transaction::where('status', 'completed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('total_amount');

        $targetProgress = $targetRevenue > 0
            ? min(100, round(($currentRevenue / $targetRevenue) * 100, 1))
            : 0;

        $targetRemaining = max(0, $targetRevenue - $currentRevenue);

        $reportLabels = [
            'monthly'    => 'Laporan Bulanan',
            'daily'      => 'Laporan Harian',
            'inventory'  => 'Laporan Inventaris',
            'profit-loss' => 'Efisiensi HPP Menu',
            'sales'      => 'Laporan Penjualan',
            'index'      => 'Ringkasan Laporan',
        ];

        $reportRoutes = [
            'monthly'    => '/reports/monthly',
            'daily'      => '/reports/daily',
            'inventory'  => '/reports/inventory',
            'profit-loss' => '/reports/profit-loss',
            'sales'      => '/reports/sales',
            'index'      => '/reports',
        ];

        $recentReports = AuditLog::where('action', 'report.viewed')
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->unique(fn($log) => $log->metadata['report'] ?? '')
            ->take(3)
            ->map(fn($log) => [
                'label' => $reportLabels[$log->metadata['report'] ?? ''] ?? 'Laporan',
                'date'  => $log->created_at->translatedFormat('d M Y'),
                'route' => $reportRoutes[$log->metadata['report'] ?? ''] ?? '/reports',
            ])
            ->values();

        $filterKasir     = User::where('role', 'cashier')->orderBy('name')->get(['id', 'name']);
        $filterKategori  = Category::orderBy('name')->get(['id', 'name']);
        $filterPayments  = Transaction::where('status', 'completed')
            ->distinct()
            ->pluck('payment_method')
            ->filter()
            ->values();

        return response()->json([
            'totalRevenue'   => $totalRevenue,
            'totalOrders'    => $totalOrders,
            'avgTransaction' => $avgTransaction,
            'totalProfit'    => $totalProfit,
            'days'           => $days,
            'revenueTrend'   => $revenueTrend,
            'revenueTrendType' => $revenueTrendType,
            'ordersTrend'    => $ordersTrend,
            'ordersTrendType' => $ordersTrendType,
            'avgTrend'       => $avgTrend,
            'avgTrendType'   => $avgTrendType,
            'profitTrend'    => $profitTrend,
            'profitTrendType' => $profitTrendType,
            'bestMenus'      => $bestMenus,
            'chartLabels'    => $chartLabels,
            'chartRevenue'   => $chartRevenue,
            'chartProfit'    => $chartProfit,
            'donutLabels'    => $donutLabels,
            'donutData'      => $donutData,
            'donutBg'        => $donutBg,
            'busySlots'      => $busySlots,
            'targetRevenue'  => $targetRevenue,
            'currentRevenue' => $currentRevenue,
            'targetProgress' => $targetProgress,
            'targetRemaining'=> $targetRemaining,
            'recentReports'  => $recentReports,
            'filterKasir'    => $filterKasir,
            'filterKategori' => $filterKategori,
            'filterPayments' => $filterPayments,
        ]);
    }

    public function revenue()
    {
        $revenue = Transaction::where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        return response()->json($revenue);
    }

    public function profit()
    {
        $revenue = Transaction::where('status', 'completed')->sum('total_amount');
        $hpp = TransactionItem::whereHas('transaction', fn($q) => $q->where('status', 'completed'))
            ->with('menu.recipe.ingredients')
            ->get()
            ->sum(function ($item) {
                $recipe = $item->menu?->recipe;
                if (!$recipe) return 0;
                return $recipe->total_hpp * $item->qty;
            });

        return response()->json(['profit' => max(0, $revenue - $hpp)]);
    }

    public function bestSellingMenu()
    {
        $menus = TransactionItem::selectRaw('menu_id, SUM(qty) as total_sold')
            ->groupBy('menu_id')
            ->orderByDesc('total_sold')
            ->with('menu')
            ->take(10)
            ->get();
        return response()->json($menus);
    }

    public function exportExcel()
    {
        $transactions = Transaction::where('status', 'completed')->latest()->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="report-' . now()->format('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($transactions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Kasir', 'Total', 'Status', 'Tanggal']);

            foreach ($transactions as $tx) {
                fputcsv($handle, [
                    $tx->id,
                    $tx->cashier?->name,
                    $tx->total_amount,
                    $tx->status,
                    $tx->created_at,
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    public function exportPdf()
    {
        return response()->json(['message' => 'Export PDF belum dikonfigurasi (DomPDF).'], 500);
    }
}

