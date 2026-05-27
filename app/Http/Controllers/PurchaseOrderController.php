<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PurchaseOrderController extends Controller
{
    
    public function index(): View
    {
        $orders = PurchaseOrder::with(['supplier', 'user'])->latest()->paginate(20);

        return view('shared.purchase-order.index', compact('orders'));
    }

    public function create(): View
    {
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::orderBy('name')->get();

        return view('shared.purchase-order.create', compact('suppliers', 'inventories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id'              => 'required|exists:suppliers,id',
            'notes'                    => 'nullable|string',
            'items'                    => 'required|array|min:1',
            'items.*.inventory_id'     => 'required|exists:inventories,id',
            'items.*.qty'              => 'required|numeric|min:0.01',
            'items.*.unit'             => 'required|string|max:50',
            'items.*.price_per_unit'   => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $total = collect($data['items'])->sum(fn($item) => (int) ($item['qty'] * $item['price_per_unit']));

            $order = PurchaseOrder::create([
                'supplier_id'  => $data['supplier_id'],
                'user_id'      => auth()->id(),
                'status'       => 'pending',
                'total_amount' => $total,
                'notes'        => $data['notes'] ?? null,
                'ordered_at'   => now(),
            ]);

            foreach ($data['items'] as $item) {
                $subtotal = (int) ($item['qty'] * $item['price_per_unit']);
                $order->items()->create([
                    'inventory_id'   => $item['inventory_id'],
                    'qty'            => $item['qty'],
                    'unit'           => $item['unit'],
                    'price_per_unit' => $item['price_per_unit'],
                    'subtotal'       => $subtotal,
                ]);
            }
        });

        return redirect()->route('purchase-orders.index')->with('success', 'PO dibuat.');
    }

    public function show(string $id): View
    {
        $order = PurchaseOrder::with(['items.inventory', 'supplier', 'user'])->findOrFail($id);

        return view('shared.purchase-order.show', compact('order'));
    }

    public function edit(string $id): View|RedirectResponse
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);

        if ($order->status !== 'pending') {
            return redirect()->route('purchase-orders.show', $order->id)
                ->with('error', 'PO tidak dapat diedit.');
        }

        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::orderBy('name')->get();

        return view('shared.purchase-order.edit', compact('order', 'suppliers', 'inventories'));
    }

    public function update(Request $request, string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return back()->with('error', 'PO tidak dapat diperbarui.');
        }

        $order->update($request->validate([
            'notes' => 'nullable|string',
        ]));

        return redirect()->route('purchase-orders.index')->with('success', 'PO diperbarui.');
    }

    public function destroy(string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return back()->with('error', 'PO tidak dapat dihapus.');
        }

        $order->delete();

        return redirect()->route('purchase-orders.index')->with('success', 'PO dihapus.');
    }

    public function approve(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'approved']);

        return back()->with('success', 'PO disetujui.');
    }

    public function reject(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'rejected']);

        return back()->with('success', 'PO ditolak.');
    }

    public function receive(string $id)
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);

        if ($order->status !== 'approved') {
            return back()->with('error', 'PO harus disetujui terlebih dahulu.');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $inventory = Inventory::find($item->inventory_id);

                if ($inventory) {
                    $inventory->adjustStock((float) $item->qty, 'in', "PO #{$order->id}");
                }
            }

            $order->update(['status' => 'received', 'received_at' => now()]);
        });

        return back()->with('success', 'Barang diterima, stok diperbarui.');
    }
}
