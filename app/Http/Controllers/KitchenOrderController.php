<?php

namespace App\Http\Controllers;

use App\Models\KitchenOrder;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class KitchenOrderController extends Controller
{
    public function index(Request $request): Response
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

        return Inertia::render('KitchenOrders/Index', [
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

    public function updateStatus(Request $request, KitchenOrder $kitchenOrder)
    {
        $request->validate([
            'status' => 'required|in:preparing,ready,completed',
        ]);

        $data = ['status' => $request->status];

        if ($request->status === 'preparing') {
            $data['prepared_at'] = now();
        } elseif ($request->status === 'completed') {
            $data['completed_at'] = now();
        }

        $kitchenOrder->update($data);

        return back();
    }

    public function show(string $id): View
    {
        $order = KitchenOrder::with(['items.menu', 'transaction.cashier'])->findOrFail($id);

        return view('shared.kitchen-order.show', compact('order'));
    }

    public function prepare(string $id)
    {
        $order = KitchenOrder::findOrFail($id);
        $order->update([
            'status'      => 'preparing',
            'prepared_at' => now(),
        ]);

        return back();
    }

    public function ready(string $id)
    {
        KitchenOrder::findOrFail($id)->update(['status' => 'ready']);

        return back();
    }

    public function complete(string $id)
    {
        KitchenOrder::findOrFail($id)->update([
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        return back();
    }
}
