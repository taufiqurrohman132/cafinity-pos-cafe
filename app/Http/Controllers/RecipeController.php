<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RecipeController extends Controller
{
    public function index(Request $request): View
    {
        $recipes     = Recipe::with(['menu.category', 'ingredients'])->latest()->get();
        $inventories = Inventory::orderBy('name')->get();

        $selectedRecipe = $request->filled('id')
            ? $recipes->firstWhere('id', $request->id)
            : $recipes->first();

        // Tambah ini — menu yang belum punya resep
        $menus = Menu::whereDoesntHave('recipe')->orderBy('name')->get();

        $inventoriesJson = $inventories->map(function ($i) {
            return [
                'id'    => $i->id,
                'name'  => $i->name,
                'price' => $i->price_per_unit,
                'unit'  => $i->unit,
            ];
        })->values()->toJson();

        return view('shared.recipe-costiong.index', compact('recipes', 'selectedRecipe', 'inventories', 'inventoriesJson', 'menus'));
    }

    public function show(string $id)
    {
        return redirect()->route('recipe.index', ['id' => $id]);
    }

    // TARUH DI SINI
    public function create(): View
    {
        $menus = Menu::whereDoesntHave('recipe')->orderBy('name')->get();
        $inventories = Inventory::orderBy('name')->get();

        $inventoriesJson = $inventories->map(function ($i) {
            return [
                'id'    => $i->id,
                'name'  => $i->name,
                'price' => $i->price_per_unit,
                'unit'  => $i->unit,
            ];
        })->values()->toJson();

        return view('shared.recipe-costiong.create', compact('menus', 'inventories', 'inventoriesJson'));
    }
    public function update(Request $request, string $id)
    {
        $recipe = Recipe::findOrFail($id);

        $data = $request->validate([
            'notes'                      => 'nullable|string',
            'ingredients'                => 'required|array|min:1',
            'ingredients.*.inventory_id' => 'required|exists:inventories,id',
            'ingredients.*.qty'          => 'required|numeric|min:0.01',
            'ingredients.*.unit'         => 'required|string|max:50',
        ]);

        $recipe->update(['notes' => $data['notes'] ?? null]);

        $sync = collect($data['ingredients'])->mapWithKeys(fn($row) => [
            $row['inventory_id'] => [
                'qty'  => $row['qty'],
                'unit' => $row['unit'],
            ],
        ])->all();

        $recipe->ingredients()->sync($sync);

        return redirect()->route('recipe.index', ['id' => $recipe->id])->with('success', 'Resep diperbarui.');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'menu_id'                    => 'required|exists:menus,id|unique:recipes,menu_id',
            'notes'                      => 'nullable|string',
            'ingredients'                => 'required|array|min:1',
            'ingredients.*.inventory_id' => 'required|exists:inventories,id',
            'ingredients.*.qty'          => 'required|numeric|min:0.01',
            'ingredients.*.unit'         => 'required|string|max:50',
        ]);

        $recipe = Recipe::create([
            'menu_id' => $data['menu_id'],
            'notes'   => $data['notes'] ?? null,
        ]);

        $sync = collect($data['ingredients'])->mapWithKeys(fn($row) => [
            $row['inventory_id'] => [
                'qty'  => $row['qty'],
                'unit' => $row['unit'],
            ],
        ])->all();

        $recipe->ingredients()->sync($sync);

        return redirect()->route('recipe.index', ['id' => $recipe->id])->with('success', 'Resep ditambahkan.');
    }
    public function destroy(string $id)
    {
        Recipe::findOrFail($id)->delete();

        return redirect()->route('recipe.index')->with('success', 'Resep dihapus.');
    }
}
