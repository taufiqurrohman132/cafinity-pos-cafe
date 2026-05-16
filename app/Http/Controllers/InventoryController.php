<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventories = Inventory::with('supplier')->paginate(20);
        return view('inventories.index', compact('inventories'));
    }

    public function create()
    {
        return view('inventories.create');
    }

    public function store(Request $request)
    {
        Inventory::create($request->validated());
        return redirect()->route('inventories.index')->with('success', 'Item ditambahkan.');
    }

    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        return view('inventories.show', compact('inventory'));
    }

    public function edit($id)
    {
        $inventory = Inventory::findOrFail($id);
        return view('inventories.edit', compact('inventory'));
    }

    public function update(Request $request, $id)
    {
        Inventory::findOrFail($id)->update($request->validated());
        return redirect()->route('inventories.index')->with('success', 'Item diperbarui.');
    }

    public function destroy($id)
    {
        Inventory::findOrFail($id)->delete();
        return redirect()->route('inventories.index')->with('success', 'Item dihapus.');
    }

    public function lowStock()
    {
        $inventories = Inventory::where('stock', '<=', DB::raw('min_stock'))->get();
        return view('inventories.low-stock', compact('inventories'));
    }

    public function restock(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->increment('stock', $request->qty);
        return back()->with('success', 'Stok berhasil ditambah.');
    }
}
