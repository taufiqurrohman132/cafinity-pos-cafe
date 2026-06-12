<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\Menu;
use App\Models\PurchaseOrder;
use App\Models\KitchenOrder;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Target;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get dashboard data depending on the user's role.
     */
    public function getDataForUser(User $user): array
    {
        return match ($user->role) {
            'owner'   => $this->getOwnerData($user),
            'admin'   => $this->getAdminData($user),
            default   => $this->getCashierData($user),
        };
    }

    /**
     * Get Owner Dashboard Data.
     */
    public function getOwnerData(User $user): array
    {
        $today     = today();
        $yesterday = today()->subDay();

        $todayRevenue     = $this->sumRevenue($today);
        $yesterdayRevenue = $this->sumRevenue($yesterday);
        $todayOrders      = $this->countOrders($today);
        $yesterdayOrders  = $this->countOrders($yesterday);
        $todayHpp         = $this->estimateHpp($today);
        $yesterdayHpp     = $this->estimateHpp($yesterday);

        $todayProfit     = max(0, $todayRevenue - $todayHpp);
        $yesterdayProfit = max(0, $yesterdayRevenue - $yesterdayHpp);

        $avgTicket          = $todayOrders > 0 ? (int) round($todayRevenue / $todayOrders) : 0;
        $yesterdayAvgTicket = $yesterdayOrders > 0 ? (int) round($yesterdayRevenue / $yesterdayOrders) : 0;

        $stats = [
            'revenue'    => ['value' => $this->rupiah($todayRevenue),   'trend' => $this->trendLabel($todayRevenue, $yesterdayRevenue),     'trend_type' => $this->trendType($todayRevenue, $yesterdayRevenue)],
            'profit'     => ['value' => $this->rupiah($todayProfit),    'trend' => $this->trendLabel($todayProfit, $yesterdayProfit),       'trend_type' => $this->trendType($todayProfit, $yesterdayProfit)],
            'orders'     => ['value' => (string) $todayOrders,          'trend' => $this->trendLabel($todayOrders, $yesterdayOrders),       'trend_type' => $this->trendType($todayOrders, $yesterdayOrders)],
            'avg_ticket' => ['value' => $this->rupiah($avgTicket),      'trend' => $this->trendLabel($avgTicket, $yesterdayAvgTicket),     'trend_type' => $this->trendType($avgTicket, $yesterdayAvgTicket)],
        ];

        $currentTarget = Target::query()
            ->where('type', 'revenue')
            ->where('period', 'daily')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->first();

        $lowStockItems = Inventory::with('category')
            ->whereColumn('stock', '<=', 'min_stock')
            ->orderBy('stock')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'id'        => $item->id,
                'name'      => $item->name,
                'stock'     => $item->stock,
                'min_stock' => $item->min_stock,
                'unit'      => $item->unit,
            ]);

        $kitchenQueue = KitchenOrder::with(['transaction', 'items.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->orderByRaw("FIELD(status, 'preparing', 'pending', 'ready')")
            ->orderBy('created_at')
            ->limit(5)
            ->get()
            ->map(fn(KitchenOrder $order) => [
                'id'       => '#TRX-' . str_pad((string) $order->transaction_id, 4, '0', STR_PAD_LEFT),
                'items'    => $order->items->map(fn($i) => $i->qty . 'x ' . ($i->menu->name ?? 'Menu'))->implode(', ') ?: '-',
                'time_ago' => $order->created_at->diffForHumans(short: true),
                'status'   => $order->status,
            ]);

        return [
            'lastUpdated'      => now()->format('H:i'),
            'stats'            => $stats,
            'salesChart'       => $this->buildSalesChart($today),
            'bestSellingMenus' => $this->bestSellingMenus($today, $yesterday),
            'busyHours'        => $this->busyHours($today),
            'profitability'    => $this->profitabilityAnalysis(),
            'dailyGoal'        => $this->dailyGoal($today, $todayRevenue),
            'currentTarget'    => $currentTarget,
            'lowStockItems'    => $lowStockItems,
            'kitchenQueue'     => $kitchenQueue,
        ];
    }

    /**
     * Get Admin Dashboard Data.
     */
    public function getAdminData(User $user): array
    {
        $lowStock = Inventory::whereColumn('stock', '<=', 'min_stock')->count();
        $pendingPo = PurchaseOrder::where('status', 'pending')->count();
        $totalSku = Inventory::count();
        $inventoryVal = Inventory::selectRaw('SUM(stock * price_per_unit) as total_val')->value('total_val') ?? 0;

        $stats = [
            'low_stock'     => $lowStock . ' Item',
            'pending_po'    => $pendingPo . ' Berkas',
            'total_sku'     => $totalSku . ' Item',
            'inventory_val' => $this->rupiah((int) $inventoryVal),
        ];

        return [
            'stats'         => $stats,
            'hppAnalysis'   => $this->profitabilityAnalysis(),
            'activityLog'   => $this->getActivityLog(),
            'stockMovement' => $this->getStockMovement(),
            'menuSummary'   => $this->getMenuSummary(),
        ];
    }

    /**
     * Get Cashier Dashboard Data.
     */
    public function getCashierData(User $user): array
    {
        $todayOrders = Transaction::where('status', 'completed')->whereDate('created_at', today())->count();
        $todayCash = Transaction::where('status', 'completed')->whereDate('created_at', today())->sum('total_amount');

        $avg = KitchenOrder::where('status', 'completed')
            ->whereDate('completed_at', today())
            ->whereNotNull('prepared_at')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, prepared_at, completed_at)) as avg_minutes')
            ->value('avg_minutes');
        
        $avgTime = $avg ? round($avg, 1) . ' Menit' : '—';

        $stats = [
            'total_orders' => $todayOrders . ' Pesanan',
            'total_cash'   => $this->rupiah((int) $todayCash),
            'avg_time'     => $avgTime,
        ];

        return [
            'stats'              => $stats,
            'recentTransactions' => $this->getRecentTransactions(),
            'lowStockItems'      => $this->getLowStockItems(),
            'shiftInfo'          => $this->getShiftInfo($user),
        ];
    }

    /**
     * Get Custom Sales Chart Data.
     */
    public function getSalesChartData(string $period): array
    {
        return match ($period) {
            '7days'  => $this->buildSalesChart7Days(),
            '30days' => $this->buildSalesChart30Days(),
            'month'  => $this->buildSalesChartThisMonth(),
            default  => $this->buildSalesChart(today()),
        };
    }

    // --- Extracted Calculation Methods ---

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
                return $recipe ? (int) ($recipe->total_hpp * $item->qty) : 0;
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

        for ($hour = 0; $hour <= 23; $hour++) {
            $labels[] = sprintf('%02d:00', $hour);
            $bucket = (int) ($hourly[$hour] ?? 0);
            $values[] = [
                'amount' => $bucket,
                'height' => (int) round(($bucket / $max) * 100),
            ];
        }

        return compact('labels', 'values', 'max');
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
                    'id' => $menu->id,
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
                    'id'         => $menu->id,
                    'name'       => $menu->name,
                    'price'      => $this->rupiah($menu->price),
                    'hpp'        => $this->rupiah($hpp),
                    'profit'     => '+ ' . $this->rupiah($profit),
                    'margin'     => $margin . '%',
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
        $progress = min(100, $target->target_value > 0 ? round(($current / $target->target_value) * 100) : 0);
        $remaining = max(0, $target->target_value - $current);

        return [
            'progress' => $progress,
            'remaining' => $this->rupiah($remaining),
            'target' => $this->rupiah($target->target_value),
            'label' => $target->label,
        ];
    }

    private function getStockMovement(): array
    {
        $daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $stockMovement = [];
        $rawMovement = [];
        $maxMovementVal = 1;

        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $inQty = (float) InventoryLog::whereDate('created_at', $date)
                ->whereColumn('stock_after', '>', 'stock_before')
                ->sum('qty');
            $outQty = (float) InventoryLog::whereDate('created_at', $date)
                ->whereColumn('stock_after', '<', 'stock_before')
                ->sum('qty');

            $rawMovement[] = [
                'in'    => $inQty,
                'out'   => $outQty,
                'label' => $daysOfWeek[(int) $date->format('w')],
            ];

            $maxMovementVal = max($maxMovementVal, $inQty, $outQty);
        }

        foreach ($rawMovement as $item) {
            $stockMovement[] = [
                'in'    => (int) round(($item['in'] / $maxMovementVal) * 100),
                'out'   => (int) round(($item['out'] / $maxMovementVal) * 100),
                'label' => $item['label'],
            ];
        }

        return $stockMovement;
    }

    private function getMenuSummary(): array
    {
        $minumanCount = Menu::where('is_active', true)
            ->whereHas('category', fn($q) => $q->whereIn('name', ['Coffee', 'Non-Coffee', 'Minuman']))
            ->count();

        $makananCount = Menu::where('is_active', true)
            ->whereHas('category', fn($q) => $q->whereIn('name', ['Main Course', 'Makanan']))
            ->count();

        $snackCount = Menu::where('is_active', true)
            ->whereHas('category', fn($q) => $q->whereIn('name', ['Snacks', 'Snack & Pastry', 'Snack', 'Pastry']))
            ->count();

        return [
            [
                'icon'        => 'solar:cup-hot-linear',
                'iconBg'      => 'bg-emerald-50',
                'iconColor'   => 'text-emerald-500',
                'name'        => 'Minuman',
                'sub'         => '(Coffee/Non)',
                'count'       => $minumanCount . ' Item Aktif',
                'status'      => 'Ready',
                'statusBg'    => 'bg-emerald-100',
                'statusColor' => 'text-emerald-600',
            ],
            [
                'icon'        => 'solar:chef-hat-linear',
                'iconBg'      => 'bg-orange-50',
                'iconColor'   => 'text-orange-400',
                'name'        => 'Makanan',
                'sub'         => 'Utama',
                'count'       => $makananCount . ' Item Aktif',
                'status'      => 'Ready',
                'statusBg'    => 'bg-emerald-100',
                'statusColor' => 'text-emerald-600',
            ],
            [
                'icon'        => 'solar:cookie-linear',
                'iconBg'      => 'bg-rose-50',
                'iconColor'   => 'text-rose-500',
                'name'        => 'Snack &',
                'sub'         => 'Pastry',
                'count'       => $snackCount . ' Item Aktif',
                'status'      => 'Ready',
                'statusBg'    => 'bg-emerald-100',
                'statusColor' => 'text-emerald-600',
            ],
        ];
    }

    private function getActivityLog(): array
    {
        return InventoryLog::with('inventory')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($log) {
                $isIn = $log->stock_after > $log->stock_before;
                return [
                    'type'        => $isIn ? 'in' : 'out',
                    'action'      => $isIn ? 'Stok Masuk' : 'Stok Keluar',
                    'time_ago'    => $log->created_at->diffForHumans(),
                    'description' => sprintf(
                        '%s: %.1f %s %s (%s)',
                        $log->inventory?->name ?? 'Item',
                        $log->qty,
                        $log->inventory?->unit ?? '',
                        $isIn ? 'ditambahkan' : 'dikurangi',
                        $log->notes ?? 'Penyesuaian stok'
                    ),
                ];
            })
            ->all();
    }

    private function getRecentTransactions(): array
    {
        return Transaction::with('items.menu')
            ->whereDate('created_at', today())
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($t) {
                return [
                    'id'     => '#TRX-' . str_pad($t->id, 4, '0', STR_PAD_LEFT),
                    'time'   => $t->created_at->format('H:i'),
                    'items'  => $t->items->map(fn($i) => $i->qty . 'x ' . ($i->menu->name ?? 'Menu'))->implode(', '),
                    'total'  => $this->rupiah($t->total_amount),
                    'status' => $t->status,
                ];
            })
            ->all();
    }

    private function getLowStockItems(): array
    {
        return Inventory::whereColumn('stock', '<=', 'min_stock')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name'      => $item->name,
                'stock'     => $item->stock,
                'min_stock' => $item->min_stock,
                'unit'      => $item->unit,
            ])
            ->all();
    }

    private function getShiftInfo(User $user): array
    {
        $hour = (int) now()->format('H');
        $shiftName = ($hour >= 8 && $hour < 16) ? 'Pagi' : 'Sore';
        $startShift = $user->shift_terakhir ?? today()->setTime($hour >= 8 && $hour < 16 ? 8 : 16, 0);
        $diffInMinutes = now()->diffInMinutes($startShift);
        $hours = floor($diffInMinutes / 60);
        $minutes = $diffInMinutes % 60;
        $duration = $hours > 0 ? "{$hours} Jam {$minutes} Menit" : "{$minutes} Menit";

        return [
            'shift'    => $shiftName,
            'start'    => $startShift->format('H:i'),
            'duration' => $duration,
            'balance'  => 'Rp 500.000',
        ];
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

    private function rupiah(int $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }
}
