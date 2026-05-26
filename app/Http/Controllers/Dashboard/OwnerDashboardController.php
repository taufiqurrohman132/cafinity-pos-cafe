<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\KitchenOrder;
use App\Models\Menu;
use App\Models\Target;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use App\Models\KitchenOrderItem;

class OwnerDashboardController extends Controller
{
    public function index(): View
    {
        $today = today();
        $yesterday = today()->subDay();

        $todayRevenue = $this->sumRevenue($today);
        $yesterdayRevenue = $this->sumRevenue($yesterday);
        $todayOrders = $this->countOrders($today);
        $yesterdayOrders = $this->countOrders($yesterday);
        $todayHpp = $this->estimateHpp($today);
        $yesterdayHpp = $this->estimateHpp($yesterday);

        $todayProfit = max(0, $todayRevenue - $todayHpp);
        $yesterdayProfit = max(0, $yesterdayRevenue - $yesterdayHpp);

        $avgTicket = $todayOrders > 0 ? (int) round($todayRevenue / $todayOrders) : 0;
        $yesterdayAvgTicket = $yesterdayOrders > 0
            ? (int) round($yesterdayRevenue / $yesterdayOrders)
            : 0;

        $stats = [
            'revenue' => [
                'value' => $this->rupiah($todayRevenue),
                'trend' => $this->trendLabel($todayRevenue, $yesterdayRevenue),
                'trend_type' => $this->trendType($todayRevenue, $yesterdayRevenue),
            ],
            'profit' => [
                'value' => $this->rupiah($todayProfit),
                'trend' => $this->trendLabel($todayProfit, $yesterdayProfit),
                'trend_type' => $this->trendType($todayProfit, $yesterdayProfit),
            ],
            'orders' => [
                'value' => (string) $todayOrders,
                'trend' => $this->trendLabel($todayOrders, $yesterdayOrders),
                'trend_type' => $this->trendType($todayOrders, $yesterdayOrders),
            ],
            'avg_ticket' => [
                'value' => $this->rupiah($avgTicket),
                'trend' => $this->trendLabel($avgTicket, $yesterdayAvgTicket),
                'trend_type' => $this->trendType($avgTicket, $yesterdayAvgTicket),
            ],
        ];

        $salesChart = $this->buildSalesChart($today);
        $bestSellingMenus = $this->bestSellingMenus($today, $yesterday);
        $busyHours = $this->busyHours($today);
        $profitability = $this->profitabilityAnalysis();
        $dailyGoal = $this->dailyGoal($today, $todayRevenue);
        $lowStockItems = Inventory::with('category')
            ->whereColumn('stock', '<=', 'min_stock')
            ->orderBy('stock')
            ->limit(5)
            ->get();

        $kitchenQueue = KitchenOrder::with(['transaction', 'items.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->orderByRaw("FIELD(status, 'preparing', 'pending', 'ready')")
            ->orderBy('created_at')
            ->limit(5)
            ->get()
            ->map(function (KitchenOrder $order) {
                $itemsSummary = $order->items
                    ->map(fn($item) => $item->qty . 'x ' . ($item->menu->name ?? 'Menu'))
                    ->implode(', ');

                return [
                    'id'             => '#TRX-' . str_pad((string) $order->transaction_id, 4, '0', STR_PAD_LEFT),
                    'transaction_id' => $order->transaction_id,
                    'items'          => $itemsSummary ?: '-',
                    'time_ago'       => $order->created_at->diffForHumans(short: true),
                    'status'         => $order->status,
                ];
            });

        $currentTarget = Target::query()
            ->where('type', 'revenue')
            ->where('period', 'daily')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->first();

        return view('dashboard.owner.index', [
            'user'           => auth()->user(),
            'lastUpdated'    => now()->format('H:i'),
            'todayLabel'     => $today->translatedFormat('d F Y'),
            'stats'          => $stats,
            'salesChart'     => $salesChart,
            'bestSellingMenus' => $bestSellingMenus,
            'busyHours'      => $busyHours,
            'profitability'  => $profitability,
            'dailyGoal'      => $dailyGoal,
            'currentTarget'  => $currentTarget,
            'lowStockItems'  => $lowStockItems,
            'kitchenQueue'   => $kitchenQueue,
            'today'          => $today,
        ]);
    }

    // OwnerDashboardController.php
    public function salesChartData(Request $request): \Illuminate\Http\JsonResponse
    {
        $period = $request->get('period', 'today');

        $data = match ($period) {
            '7days'   => $this->buildSalesChart7Days(),
            '30days'  => $this->buildSalesChart30Days(),
            'month'   => $this->buildSalesChartThisMonth(),
            default   => $this->buildSalesChart(today()),
        };

        return response()->json($data);
    }

    private function buildSalesChart7Days(): array
    {
        $days = collect(range(6, 0))->map(fn($i) => today()->subDays($i));

        $labels = $days->map(fn($d) => $d->format('d/m'))->all();
        $values = $days->map(function ($day) {
            $amount = (int) Transaction::query()
                ->where('status', 'completed')
                ->whereDate('created_at', $day)
                ->sum('total_amount');

            return ['amount' => $amount, 'height' => 0];
        })->all();

        $max = max(collect($values)->max('amount') ?: 1, 1);

        foreach ($values as &$v) {
            $v['height'] = (int) round(($v['amount'] / $max) * 100);
        }

        return compact('labels', 'values', 'max');
    }

    private function buildSalesChart30Days(): array
    {
        $days = collect(range(29, 0))->map(fn($i) => today()->subDays($i));

        $labels = $days->map(fn($d) => $d->format('d/m'))->all();
        $values = $days->map(function ($day) {
            $amount = (int) Transaction::query()
                ->where('status', 'completed')
                ->whereDate('created_at', $day)
                ->sum('total_amount');

            return ['amount' => $amount, 'height' => 0];
        })->all();

        $max = max(collect($values)->max('amount') ?: 1, 1);

        foreach ($values as &$v) {
            $v['height'] = (int) round(($v['amount'] / $max) * 100);
        }

        return compact('labels', 'values', 'max');
    }

    private function buildSalesChartThisMonth(): array
    {
        $start = today()->startOfMonth();
        $end   = today()->endOfMonth();
        $days  = collect();

        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $days->push($d->copy());
        }

        $labels = $days->map(fn($d) => $d->format('d/m'))->all();
        $values = $days->map(function ($day) {
            $amount = (int) Transaction::query()
                ->where('status', 'completed')
                ->whereDate('created_at', $day)
                ->sum('total_amount');

            return ['amount' => $amount, 'height' => 0];
        })->all();

        $max = max(collect($values)->max('amount') ?: 1, 1);

        foreach ($values as &$v) {
            $v['height'] = (int) round(($v['amount'] / $max) * 100);
        }

        return compact('labels', 'values', 'max');
    }

    /**
     * Owner kitchen queue detail — maps KitchenOrder data to detail-antrean blade format.
     */
    public function detailAntrean(): View
    {
        $orders = KitchenOrder::with(['items.menu', 'transaction.cashier'])
            ->whereIn('status', ['pending', 'preparing', 'ready', 'completed'])
            ->orderByRaw("FIELD(status, 'preparing', 'pending', 'ready', 'completed')")
            ->orderBy('created_at')
            ->get()
            ->map(function (KitchenOrder $ko) {
                $statusMatch = match ($ko->status) {
                    'preparing'  => ['label' => 'Memasak',  'done' => false],
                    'pending'    => ['label' => 'Menunggu', 'done' => false],
                    'ready'      => ['label' => 'Siap',     'done' => false],
                    'completed'  => ['label' => 'Siap',     'done' => true],
                    default      => ['label' => 'Menunggu', 'done' => false],
                };

                $actionLabel = match ($ko->status) {
                    'pending'    => 'Mulai Memasak',
                    'preparing'  => 'Tandai Siap',
                    'ready'      => 'Telah Diambil',
                    'completed'  => 'Telah Diambil',
                    default      => 'Mulai Memasak',
                };

                return [
                    'id'     => '#TRX-' . str_pad((string) $ko->transaction_id, 4, '0', STR_PAD_LEFT),
                    'waktu'  => $ko->created_at->diffForHumans(short: true),
                    'tipe'   => 'Dine-in',
                    'meja'   => null,
                    'status' => $statusMatch['label'],
                    'done'   => $statusMatch['done'],
                    'items'  => $ko->items->map(function (KitchenOrderItem $item) {
                        return [
                            'qty'   => $item->qty . 'x',
                            'nama'  => $item->menu->name ?? 'Menu',
                            'note'  => $item->notes ?? null,
                            'type'  => $item->menu?->category?->name
                                ? str_contains(strtolower($item->menu->category->name), 'minuman') ? 'drink' : 'food'
                                : 'food',
                            'done'  => false,
                        ];
                    })
                        ->all(),
                    'actions' => [$actionLabel, ''],
                ];
            })
            ->all();

        return view('dashboard.owner.detail-antrean', compact('orders'));
    }

    private function sumRevenue($date): int
    {
        return (int) Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $date)
            ->sum('total_amount');
    }

    private function countOrders($date): int
    {
        return Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $date)
            ->count();
    }

    private function estimateHpp($date): int
    {
        return (int) TransactionItem::query()
            ->whereHas('transaction', fn($q) => $q
                ->where('status', 'completed')
                ->whereDate('created_at', $date))
            ->with('menu.recipe.ingredients')
            ->get()
            ->sum(function (TransactionItem $item) {
                $recipe = $item->menu?->recipe;

                if (! $recipe) {
                    return 0;
                }

                return (int) ($recipe->total_hpp * $item->qty);
            });
    }

    private function buildSalesChart($date): array
    {
        $hourly = Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $date)
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('total', 'hour');

        $labels = [];
        $values = [];
        $max = max($hourly->max() ?: 1, 1);

        // Sebelum: $hour <= 20, akses $hourly[21] yang tidak pernah ada
        // Sesudah: $hour <= 22, cover transaksi sampai jam 23
        for ($hour = 8; $hour <= 22; $hour += 2) {
            $labels[] = sprintf('%02d:00', $hour);
            $bucket = (int) (($hourly[$hour] ?? 0) + ($hourly[$hour + 1] ?? 0));
            $values[] = [
                'amount' => $bucket,
                'height' => (int) round(($bucket / $max) * 100),
            ];
        }

        return compact('labels', 'values', 'max');
    }

    private function bestSellingMenus($today, $yesterday): array
    {
        $todayIds = Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $today)
            ->pluck('id');

        $yesterdayIds = Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $yesterday)
            ->pluck('id');

        $todaySales = TransactionItem::query()
            ->whereIn('transaction_id', $todayIds)
            ->select('menu_id', DB::raw('SUM(qty) as total_qty'))
            ->groupBy('menu_id')
            ->pluck('total_qty', 'menu_id');

        $yesterdaySales = TransactionItem::query()
            ->whereIn('transaction_id', $yesterdayIds)
            ->select('menu_id', DB::raw('SUM(qty) as total_qty'))
            ->groupBy('menu_id')
            ->pluck('total_qty', 'menu_id');

        $menuIds = $todaySales->keys()->take(5);

        return Menu::with('category')
            ->whereIn('id', $menuIds)
            ->get()
            ->sortByDesc(fn(Menu $menu) => $todaySales[$menu->id] ?? 0)
            ->take(3)
            ->values()
            ->map(function (Menu $menu) use ($todaySales, $yesterdaySales) {
                $todayQty = (int) ($todaySales[$menu->id] ?? 0);
                $yesterdayQty = (int) ($yesterdaySales[$menu->id] ?? 0);

                return [
                    'name' => $menu->name,
                    'category' => $menu->category?->name ?? '-',
                    'sold' => $todayQty . ' Porsi',
                    'trend' => $this->trendLabel($todayQty, $yesterdayQty),
                    'trend_type' => $this->trendType($todayQty, $yesterdayQty),
                    'emoji' => $this->menuEmoji($menu->name),
                ];
            })
            ->all();
    }

    private function busyHours($date): array
    {
        $hourly = Transaction::query()
            ->where('status', 'completed')
            ->whereDate('created_at', $date)
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('COUNT(*) as total'))
            ->groupBy('hour')
            ->pluck('total', 'hour');

        $buckets = [
            ['label' => '08-10', 'hours' => [8, 9]],
            ['label' => '10-12', 'hours' => [10, 11]],
            ['label' => '12-14', 'hours' => [12, 13]],
            ['label' => '14-16', 'hours' => [14, 15]],
            ['label' => '16-18', 'hours' => [16, 17]],
            ['label' => '18-20', 'hours' => [18, 19]],
        ];

        $counts = collect($buckets)->map(function (array $bucket) use ($hourly) {
            return collect($bucket['hours'])->sum(fn($h) => (int) ($hourly[$h] ?? 0));
        });

        $max = max($counts->max() ?: 1, 1);

        return collect($buckets)->map(function (array $bucket, int $index) use ($counts, $max) {
            $count = $counts[$index];

            return [
                'label' => $bucket['label'],
                'count' => $count,
                'height' => (int) round(($count / $max) * 100),
            ];
        })->all();
    }

    private function profitabilityAnalysis(): array
    {
        return Menu::with(['recipe.ingredients', 'category'])
            ->where('is_active', true)
            ->get()
            ->map(function (Menu $menu) {
                $hpp = $menu->recipe?->total_hpp ?? 0;
                $profit = max(0, $menu->price - $hpp);
                $margin = $menu->price > 0 ? round(($profit / $menu->price) * 100) : 0;

                return [
                    'name' => $menu->name,
                    'price' => $this->rupiah($menu->price),
                    'hpp' => $this->rupiah($hpp),
                    'profit' => '+ ' . $this->rupiah($profit),
                    'margin' => $margin . '%',
                    'margin_pct' => $margin,
                ];
            })
            ->sortByDesc('margin_pct')
            ->take(5)
            ->values()
            ->all();
    }

    private function dailyGoal($today, int $todayRevenue): array
    {
        $target = Target::query()
            ->where('type', 'revenue')
            ->where('period', 'daily')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->first();

        if (! $target) {
            return [
                'progress' => 0,
                'remaining' => $this->rupiah(0),
                'target' => $this->rupiah(0),
                'label' => 'Belum ada target harian',
            ];
        }

        $current = max($target->current_value, $todayRevenue);
        $progress = min(100, $target->target_value > 0
            ? round(($current / $target->target_value) * 100)
            : 0);
        $remaining = max(0, $target->target_value - $current);

        return [
            'progress' => $progress,
            'remaining' => $this->rupiah($remaining),
            'target' => $this->rupiah($target->target_value),
            'label' => $target->label,
        ];
    }

    private function rupiah(int $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    private function trendLabel(int|float $current, int|float $previous): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+ 100%' : '0%';
        }

        $change = (($current - $previous) / $previous) * 100;

        return ($change >= 0 ? '+ ' : '- ') . number_format(abs($change), 1) . '%';
    }

    private function trendType(int|float $current, int|float $previous): string
    {
        return $current >= $previous ? 'up' : 'down';
    }

    private function menuEmoji(string $name): string
    {
        $lower = strtolower($name);

        return match (true) {
            str_contains($lower, 'kopi'), str_contains($lower, 'coffee'), str_contains($lower, 'latte'), str_contains($lower, 'espresso') => '☕',
            str_contains($lower, 'matcha'), str_contains($lower, 'tea'), str_contains($lower, 'teh') => '🍵',
            str_contains($lower, 'croissant'), str_contains($lower, 'roti'), str_contains($lower, 'bread') => '🥐',
            str_contains($lower, 'nasi'), str_contains($lower, 'rice') => '🍚',
            default => '🍽️',
        };
    }
}
