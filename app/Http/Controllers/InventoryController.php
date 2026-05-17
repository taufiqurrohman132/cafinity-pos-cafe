<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InventoryController extends Controller
{
    public function index(): View
    {
        $inventories = Inventory::with(['supplier', 'category'])->latest()->paginate(20);

        return view('shared.inventory.index', compact('inventories'));
    }

    public function create(): View
    {
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $categories = InventoryCategory::orderBy('name')->get();

        return view('shared.inventory.create', compact('suppliers', 'categories'));
    }

    public function store(Request $request)
    {
        Inventory::create($request->validate([
            'name'                   => 'required|string|max:255',
            'unit'                   => 'required|string|max:50',
            'stock'                  => 'nullable|numeric|min:0',
            'min_stock'              => 'nullable|numeric|min:0',
            'price_per_unit'         => 'nullable|integer|min:0',
            'supplier_id'            => 'nullable|exists:suppliers,id',
            'inventory_category_id'  => 'nullable|exists:inventory_categories,id',
        ]));

        return redirect()->route('inventories.index')->with('success', 'Item ditambahkan.');
    }

    public function show(string $id): View
    {
        $inventory = Inventory::with(['supplier', 'category', 'logs.user'])->findOrFail($id);

        return view('shared.inventory.show', compact('inventory'));
    }

    public function edit(string $id): View
    {
        $inventory = Inventory::findOrFail($id);
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $categories = InventoryCategory::orderBy('name')->get();

        return view('shared.inventory.edit', compact('inventory', 'suppliers', 'categories'));
    }

    public function update(Request $request, string $id)
    {
        Inventory::findOrFail($id)->update($request->validate([
            'name'                   => 'required|string|max:255',
            'unit'                   => 'required|string|max:50',
            'stock'                  => 'nullable|numeric|min:0',
            'min_stock'              => 'nullable|numeric|min:0',
            'price_per_unit'         => 'nullable|integer|min:0',
            'supplier_id'            => 'nullable|exists:suppliers,id',
            'inventory_category_id'  => 'nullable|exists:inventory_categories,id',
        ]));

        return redirect()->route('inventories.index')->with('success', 'Item diperbarui.');
    }

    public function destroy(string $id)
    {
        Inventory::findOrFail($id)->delete();

        return redirect()->route('inventories.index')->with('success', 'Item dihapus.');
    }

    public function lowStock(): View
    {
        $inventories = Inventory::with(['supplier', 'category'])
            ->whereColumn('stock', '<=', 'min_stock')
            ->get();

        return view('shared.inventory.low-stock', compact('inventories'));
    }

    public function restock(Request $request, string $id)
    {
        $data = $request->validate(['qty' => 'required|numeric|min:0.01']);

        $inventory = Inventory::findOrFail($id);
        $inventory->adjustStock((float) $data['qty'], 'restock', 'Restock manual');

        return back()->with('success', 'Stok berhasil ditambah.');
    }
}
