<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\KitchenOrder;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Cashier/Index', [
            'user'               => auth()->user(),
            'stats'              => $this->getStats(),
            'recentTransactions' => $this->getRecentTransactions(),
            'lowStockItems'      => $this->getLowStockItems(),
            'shiftInfo'          => $this->getShiftInfo(),
        ]);
    }

    private function getStats(): array
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

        return [
            'total_orders' => $todayOrders . ' Pesanan',
            'total_cash'   => $this->rupiah((int) $todayCash),
            'avg_time'     => $avgTime,
        ];
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

    private function getShiftInfo(): array
    {
        $user = auth()->user();
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

    private function rupiah(int $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }
}
