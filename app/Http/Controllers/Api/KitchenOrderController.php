<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KitchenOrder;
use Illuminate\Http\Request;

class KitchenOrderController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'all');

        $query = KitchenOrder::with(['items.menu.category', 'transaction'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->latest();

        if ($filter !== 'all') {
            $query->where('status', $filter);
        }

        $orders = $query->get()->map(fn($o) => [
            'id'             => $o->id,
            'transaction_id' => $o->transaction_id,
            'status'         => $o->status,
            'notes'          => $o->notes,
            'created_at'     => $o->created_at->toIso8601String(),
            'items'          => $o->items->map(fn($i) => [
                'qty'   => $i->qty,
                'notes' => $i->notes,
                'menu'  => [
                    'name'     => $i->menu?->name,
                    'category' => ['name' => $i->menu?->category?->name],
                ],
            ]),
        ]);

        $lateThreshold = now()->subMinutes(15);

        return response()->json([
            'orders' => $orders,
            'filter' => $filter,
            'stats'  => [
                'active_orders'   => KitchenOrder::whereIn('status', ['pending', 'preparing'])->count(),
                'late_orders'     => KitchenOrder::whereIn('status', ['pending', 'preparing'])
                    ->where('created_at', '<=', $lateThreshold)->count(),
                'completed_today' => KitchenOrder::where('status', 'completed')
                    ->whereDate('updated_at', today())->count(),
                'avg_cook_time'   => $this->getAvgCookTime(),
            ],
        ]);
    }

    private function getAvgCookTime(): string
    {
        $avg = KitchenOrder::where('status', 'completed')
            ->whereDate('completed_at', today())
            ->whereNotNull('prepared_at')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, prepared_at, completed_at)) as avg_minutes')
            ->value('avg_minutes');

        if (!$avg) return '—';
        return round($avg, 1) . 'm';
    }

    public function show(string $id)
    {
        $order = KitchenOrder::with(['items.menu', 'transaction.cashier'])->findOrFail($id);
        return response()->json([
            'order' => $order
        ]);
    }

    public function prepare(string $id)
    {
        $order = KitchenOrder::findOrFail($id);
        $order->update([
            'status'      => 'preparing',
            'prepared_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan sedang dipersiapkan.',
            'order' => $order
        ]);
    }

    public function ready(string $id)
    {
        $order = KitchenOrder::findOrFail($id);
        $order->update(['status' => 'ready']);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan siap diambil.',
            'order' => $order
        ]);
    }

    public function complete(string $id)
    {
        $order = KitchenOrder::findOrFail($id);
        $order->update([
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan selesai.',
            'order' => $order
        ]);
    }
}
