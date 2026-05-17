<?php

namespace App\Http\Controllers;

use App\Models\KitchenOrder;
use Illuminate\Http\Request;
use Illuminate\View\View;

class KitchenOrderController extends Controller
{
    public function index(): View
    {
        $orders = KitchenOrder::with(['items.menu', 'transaction'])
            ->whereIn('status', ['pending', 'preparing'])
            ->latest()
            ->get();

        return view('shared.kitchen-order.index', compact('orders'));
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
