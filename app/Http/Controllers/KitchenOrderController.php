<?php

namespace App\Http\Controllers;

use App\Models\KitchenOrder;
use Illuminate\Http\Request;

class KitchenOrderController extends Controller
{
    //
    public function index()
    {
        $orders = KitchenOrder::with('items')->whereIn('status', ['pending', 'preparing'])->get();
        return view('kitchen-orders.index', compact('orders'));
    }

    public function show($id)
    {
        $order = KitchenOrder::with('items')->findOrFail($id);
        return view('kitchen-orders.show', compact('order'));
    }

    public function prepare($id)
    {
        KitchenOrder::findOrFail($id)->update(['status' => 'preparing']);
        return back();
    }

    public function ready($id)
    {
        KitchenOrder::findOrFail($id)->update(['status' => 'ready']);
        return back();
    }

    public function complete($id)
    {
        KitchenOrder::findOrFail($id)->update(['status' => 'completed']);
        return back();
    }
}
