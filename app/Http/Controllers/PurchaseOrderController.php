<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    //
    public function index()
    {
        $orders = PurchaseOrder::with('supplier')->latest()->paginate(20);
        return view('purchase-orders.index', compact('orders'));
    }

    public function create()
    {
        $suppliers = Supplier::all();
        $inventories = Inventory::all();
        return view('purchase-orders.create', compact('suppliers', 'inventories'));
    }

    public function store(Request $request)
    {
        $order = PurchaseOrder::create($request->validated());
        $order->items()->createMany($request->items);
        return redirect()->route('purchase-orders.index')->with('success', 'PO dibuat.');
    }

    public function show($id)
    {
        $order = PurchaseOrder::with('items', 'supplier')->findOrFail($id);
        return view('purchase-orders.show', compact('order'));
    }

    public function edit($id)
    {
        $order = PurchaseOrder::findOrFail($id);
        return view('purchase-orders.edit', compact('order'));
    }

    public function update(Request $request, $id)
    {
        PurchaseOrder::findOrFail($id)->update($request->validated());
        return redirect()->route('purchase-orders.index')->with('success', 'PO diperbarui.');
    }

    public function destroy($id)
    {
        PurchaseOrder::findOrFail($id)->delete();
        return redirect()->route('purchase-orders.index')->with('success', 'PO dihapus.');
    }

    public function approve($id)
    {
        PurchaseOrder::findOrFail($id)->update(['status' => 'approved']);
        return back()->with('success', 'PO disetujui.');
    }

    public function reject($id)
    {
        PurchaseOrder::findOrFail($id)->update(['status' => 'rejected']);
        return back()->with('success', 'PO ditolak.');
    }

    public function receive($id)
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);
        foreach ($order->items as $item) {
            Inventory::find($item->inventory_id)->increment('stock', $item->qty);
        }
        $order->update(['status' => 'received']);
        return back()->with('success', 'Barang diterima, stok diperbarui.');
    }
}
