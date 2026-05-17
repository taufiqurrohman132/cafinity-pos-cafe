<?php

namespace App\Http\Controllers;

use App\Models\Bundle;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BundleController extends Controller
{
    public function index(): View
    {
        $bundles = Bundle::with('menus')->latest()->paginate(20);

        return view('shared.promotion.index', compact('bundles'));
    }

    public function create(): View
    {
        $menus = Menu::where('is_active', true)->orderBy('name')->get();

        return view('shared.promotion.index', compact('menus'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'menus'       => 'nullable|array',
            'menus.*.id'  => 'required|exists:menus,id',
            'menus.*.qty' => 'required|integer|min:1',
        ]);

        $bundle = Bundle::create(collect($data)->except('menus')->toArray());

        if (! empty($data['menus'])) {
            $sync = collect($data['menus'])->mapWithKeys(fn ($item) => [
                $item['id'] => ['qty' => $item['qty']],
            ])->all();
            $bundle->menus()->sync($sync);
        }

        return redirect()->route('bundles.index')->with('success', 'Bundle ditambahkan.');
    }

    public function show(string $id): View
    {
        $bundle = Bundle::with('menus')->findOrFail($id);

        return view('shared.promotion.index', compact('bundle'));
    }

    public function edit(string $id): View
    {
        $bundle = Bundle::with('menus')->findOrFail($id);
        $menus = Menu::where('is_active', true)->orderBy('name')->get();

        return view('shared.promotion.index', compact('bundle', 'menus'));
    }

    public function update(Request $request, string $id)
    {
        $bundle = Bundle::findOrFail($id);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'menus'       => 'nullable|array',
            'menus.*.id'  => 'required|exists:menus,id',
            'menus.*.qty' => 'required|integer|min:1',
        ]);

        $bundle->update(collect($data)->except('menus')->toArray());

        if (isset($data['menus'])) {
            $sync = collect($data['menus'])->mapWithKeys(fn ($item) => [
                $item['id'] => ['qty' => $item['qty']],
            ])->all();
            $bundle->menus()->sync($sync);
        }

        return redirect()->route('bundles.index')->with('success', 'Bundle diperbarui.');
    }

    public function destroy(string $id)
    {
        Bundle::findOrFail($id)->delete();

        return redirect()->route('bundles.index')->with('success', 'Bundle dihapus.');
    }
}
