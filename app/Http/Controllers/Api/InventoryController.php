<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::with(['supplier', 'category'])->latest();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->status === 'low') {
            $query->whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0);
        } elseif ($request->status === 'empty') {
            $query->where('stock', 0);
        } elseif ($request->status === 'safe') {
            $query->whereColumn('stock', '>', 'min_stock');
        }

        $inventories   = $query->paginate(20)->withQueryString();
        $totalValue    = Inventory::sum(DB::raw('stock * price_per_unit'));
        $lowStockCount = Inventory::whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0)->count();
        $restockCount  = Inventory::whereColumn('stock', '<=', DB::raw('min_stock * 1.5'))->count();
        $recentLogs    = \App\Models\InventoryLog::with(['inventory', 'user'])->latest()->limit(5)->get();
        $criticalItem  = Inventory::whereColumn('stock', '<=', 'min_stock')
            ->where('stock', '>', 0)
            ->orderByRaw('stock / min_stock ASC')
            ->first();

        return response()->json([
            'inventories'   => $inventories,
            'totalValue'    => $totalValue,
            'lowStockCount' => $lowStockCount,
            'restockCount'  => $restockCount,
            'recentLogs'    => $recentLogs,
            'criticalItem'  => $criticalItem
        ]);
    }

    public function create()
    {
        return response()->json([
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => InventoryCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'unit'                  => 'required|string|max:50',
            'stock'                 => 'nullable|numeric|min:0',
            'min_stock'             => 'nullable|numeric|min:0',
            'price_per_unit'        => 'nullable|integer|min:0',
            'supplier_id'           => 'nullable|exists:suppliers,id',
            'inventory_category_id' => 'nullable|exists:inventory_categories,id',
        ]);

        $inventory = Inventory::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Item ditambahkan.',
            'inventory' => $inventory
        ]);
    }

    public function show(string $id)
    {
        $inventory = Inventory::with(['supplier', 'category', 'logs.user'])->findOrFail($id);
        return response()->json([
            'inventory' => $inventory
        ]);
    }

    public function edit(string $id)
    {
        return response()->json([
            'inventory'  => Inventory::findOrFail($id),
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => InventoryCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $inventory = Inventory::findOrFail($id);

        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'unit'                  => 'required|string|max:50',
            'stock'                 => 'nullable|numeric|min:0',
            'min_stock'             => 'nullable|numeric|min:0',
            'price_per_unit'        => 'nullable|integer|min:0',
            'supplier_id'           => 'nullable|exists:suppliers,id',
            'inventory_category_id' => 'nullable|exists:inventory_categories,id',
        ]);

        $inventory->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Item diperbarui.',
            'inventory' => $inventory
        ]);
    }

    public function destroy(string $id)
    {
        Inventory::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item dihapus.'
        ]);
    }

    public function lowStock()
    {
        $inventories = Inventory::with(['supplier', 'category'])
            ->whereColumn('stock', '<=', 'min_stock')
            ->get();
        return response()->json([
            'inventories' => $inventories
        ]);
    }

    public function restock(Request $request, string $id)
    {
        $data = $request->validate(['qty' => 'required|numeric|min:0.01']);
        $inventory = Inventory::findOrFail($id);
        $inventory->adjustStock((float) $data['qty'], 'restock', 'Restock manual');

        return response()->json([
            'success' => true,
            'message' => 'Stok berhasil ditambah.',
            'inventory' => $inventory
        ]);
    }
}
