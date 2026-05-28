<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    use AuthorizesRequests;


    public function index(Request $request): Response
    {

        $query = Inventory::with(['supplier', 'category'])->latest();

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter status
        if ($request->status === 'low') {
            $query->whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0);
        } elseif ($request->status === 'empty') {
            $query->where('stock', 0);
        } elseif ($request->status === 'safe') {
            $query->whereColumn('stock', '>', 'min_stock');
        }

        $inventories   = $query->paginate(20)->withQueryString();
        $totalValue    = Inventory::sum(\DB::raw('stock * price_per_unit'));
        $lowStockCount = Inventory::whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0)->count();
        $restockCount  = Inventory::whereColumn('stock', '<=', \DB::raw('min_stock * 1.5'))->count();
        $recentLogs    = \App\Models\InventoryLog::with(['inventory', 'user'])->latest()->limit(5)->get();
        $criticalItem  = Inventory::whereColumn('stock', '<=', 'min_stock')
            ->where('stock', '>', 0)
            ->orderByRaw('stock / min_stock ASC')
            ->first();

        return Inertia::render('Inventories/Index', compact(
            'inventories',
            'totalValue',
            'lowStockCount',
            'restockCount',
            'recentLogs',
            'criticalItem'
        ));
    }

    public function create(): Response
    {
        $this->authorize('manage-menu');

        return Inertia::render('Inventories/Create', [
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => InventoryCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('manage-menu');

        Inventory::create($request->validate([
            'name'                  => 'required|string|max:255',
            'unit'                  => 'required|string|max:50',
            'stock'                 => 'nullable|numeric|min:0',
            'min_stock'             => 'nullable|numeric|min:0',
            'price_per_unit'        => 'nullable|integer|min:0',
            'supplier_id'           => 'nullable|exists:suppliers,id',
            'inventory_category_id' => 'nullable|exists:inventory_categories,id',
        ]));

        return redirect()->route('inventories.index')->with('success', 'Item ditambahkan.');
    }

    public function show(string $id): Response
    {
        $inventory = Inventory::with(['supplier', 'category', 'logs.user'])->findOrFail($id);

        return Inertia::render('Inventories/Show', [
            'inventory' => $inventory,
        ]);
    }

    public function edit(string $id): Response
    {
        $this->authorize('manage-menu');

        return Inertia::render('Inventories/Edit', [
            'inventory'  => Inventory::findOrFail($id),
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => InventoryCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $this->authorize('manage-menu');

        Inventory::findOrFail($id)->update($request->validate([
            'name'                  => 'required|string|max:255',
            'unit'                  => 'required|string|max:50',
            'stock'                 => 'nullable|numeric|min:0',
            'min_stock'             => 'nullable|numeric|min:0',
            'price_per_unit'        => 'nullable|integer|min:0',
            'supplier_id'           => 'nullable|exists:suppliers,id',
            'inventory_category_id' => 'nullable|exists:inventory_categories,id',
        ]));

        return redirect()->route('inventories.index')->with('success', 'Item diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->authorize('manage-menu');
        Inventory::findOrFail($id)->delete();
        return redirect()->route('inventories.index')->with('success', 'Item dihapus.');
    }

    public function lowStock(): Response
    {
        return Inertia::render('Inventories/LowStock', [
            'inventories' => Inventory::with(['supplier', 'category'])
                ->whereColumn('stock', '<=', 'min_stock')
                ->get(),
        ]);
    }

    public function restock(Request $request, string $id)
    {
        $this->authorize('manage-menu');
        $data = $request->validate(['qty' => 'required|numeric|min:0.01']);
        Inventory::findOrFail($id)->adjustStock((float) $data['qty'], 'restock', 'Restock manual');
        return back()->with('success', 'Stok berhasil ditambah.');
    }

}
