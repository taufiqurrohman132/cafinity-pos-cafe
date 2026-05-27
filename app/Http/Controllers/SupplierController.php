<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SupplierController extends Controller
{
    
    public function index(): View
    {
        $suppliers = Supplier::latest()->paginate(20);

        return view('shared.supplier.index', compact('suppliers'));
    }

    public function create(): View
    {
        return view('shared.supplier.create');
    }

    public function store(Request $request)
    {
        Supplier::create($request->validate([
            'name'      => 'required|string|max:255',
            'phone'     => 'nullable|string|max:50',
            'email'     => 'nullable|email|max:255',
            'address'   => 'nullable|string',
            'is_active' => 'boolean',
        ]));

        return redirect()->route('suppliers.index')->with('success', 'Supplier ditambahkan.');
    }

    public function show(string $id): View
    {
        $supplier = Supplier::with('inventories')->findOrFail($id);

        return view('shared.supplier.show', compact('supplier'));
    }

    public function edit(string $id): View
    {
        $supplier = Supplier::findOrFail($id);

        return view('shared.supplier.edit', compact('supplier'));
    }

    public function update(Request $request, string $id)
    {
        Supplier::findOrFail($id)->update($request->validate([
            'name'      => 'required|string|max:255',
            'phone'     => 'nullable|string|max:50',
            'email'     => 'nullable|email|max:255',
            'address'   => 'nullable|string',
            'is_active' => 'boolean',
        ]));

        return redirect()->route('suppliers.index')->with('success', 'Supplier diperbarui.');
    }

    public function destroy(string $id)
    {
        Supplier::findOrFail($id)->delete();

        return redirect()->route('suppliers.index')->with('success', 'Supplier dihapus.');
    }
}
