<?php

namespace App\Http\Controllers;

use App\Models\KitchenOrder;
use Illuminate\Http\Request;
use Illuminate\View\View;

class KitchenOrderController extends Controller
{
    public function index(Request $request): View
    {
        $filter = $request->get('filter', 'all');

        $query = KitchenOrder::with(['items.menu', 'transaction'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->latest();

        if ($filter !== 'all') {
            $statusMap = [
                'waiting'   => 'pending',
                'preparing' => 'preparing',
                'ready'     => 'ready',
            ];
            if (isset($statusMap[$filter])) {
                $query->where('status', $statusMap[$filter]);
            }
        }

        $orders = $query->get();

        $stats = [
            'active_orders'    => KitchenOrder::whereIn('status', ['pending', 'preparing'])->count(),
            'late_orders'      => KitchenOrder::whereIn('status', ['pending', 'preparing'])
                ->where('created_at', '<=', now()->subMinutes(15))
                ->count(),
            'completed_today'  => KitchenOrder::where('status', 'completed')
                ->whereDate('completed_at', today())
                ->count(),
            'avg_cook_time'    => $this->getAvgCookTime(),
        ];

        return view('shared.kitchen-order.index', compact('orders', 'filter', 'stats'));
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
