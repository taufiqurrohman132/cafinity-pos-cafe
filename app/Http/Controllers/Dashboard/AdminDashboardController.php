<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\Menu;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'user'          => auth()->user(),
            'stats'         => $this->getStats(),
            'hppAnalysis'   => $this->profitabilityAnalysis(),
            'activityLog'   => $this->getActivityLog(),
            'stockMovement' => $this->getStockMovement(),
            'menuSummary'   => $this->getMenuSummary(),
        ]);
    }

    private function getStats(): array
    {
        $lowStock = Inventory::whereColumn('stock', '<=', 'min_stock')->count();
        $pendingPo = PurchaseOrder::where('status', 'pending')->count();
        $totalSku = Inventory::count();
        $inventoryVal = Inventory::selectRaw('SUM(stock * price_per_unit) as total_val')->value('total_val') ?? 0;

        return [
            'low_stock'     => $lowStock . ' Item',
            'pending_po'    => $pendingPo . ' Berkas',
            'total_sku'     => $totalSku . ' Item',
            'inventory_val' => $this->rupiah((int) $inventoryVal),
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

    private function rupiah(int $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }
}
