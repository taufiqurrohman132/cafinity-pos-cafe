<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $recipes = Recipe::with(['menu.category', 'ingredients'])->latest()->get();
        $inventories = Inventory::orderBy('name', 'asc')->get(['id', 'name', 'price_per_unit', 'unit']);
        $menus = Menu::whereDoesntHave('recipe')->orderBy('name', 'asc')->get(['id', 'name', 'price']);

        $selectedRecipe = $request->filled('id')
            ? $recipes->where('id', $request->id)->first()
            : $recipes->first();

        return response()->json([
            'recipes'        => $recipes,
            'selectedRecipe' => $selectedRecipe,
            'inventories'    => $inventories->map(fn($i) => [
                'id'    => $i->id,
                'name'  => $i->name,
                'price' => $i->price_per_unit,
                'unit'  => $i->unit,
            ]),
            'menus' => $menus,
        ]);
    }

    public function show(string $id)
    {
        $recipes = Recipe::with(['menu.category', 'ingredients'])->latest()->get();
        $inventories = Inventory::orderBy('name', 'asc')->get(['id', 'name', 'price_per_unit', 'unit']);
        $menus = Menu::whereDoesntHave('recipe')->orderBy('name', 'asc')->get(['id', 'name', 'price']);
        
        $selectedRecipe = $recipes->where('id', $id)->first();

        return response()->json([
            'recipes'        => $recipes,
            'selectedRecipe' => $selectedRecipe,
            'inventories'    => $inventories->map(fn($i) => [
                'id'    => $i->id,
                'name'  => $i->name,
                'price' => $i->price_per_unit,
                'unit'  => $i->unit,
            ]),
            'menus' => $menus,
        ]);
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
            $row['inventory_id'] => ['qty' => $row['qty'], 'unit' => $row['unit']],
        ])->all();

        $recipe->ingredients()->sync($sync);
        $recipe->load('ingredients');
        $recipe->recalculateHpp();

        return response()->json([
            'success' => true,
            'message' => 'Resep ditambahkan.',
            'recipe' => $recipe
        ]);
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
            $row['inventory_id'] => ['qty' => $row['qty'], 'unit' => $row['unit']],
        ])->all();

        $recipe->ingredients()->sync($sync);
        $recipe->load('ingredients');
        $recipe->recalculateHpp();

        return response()->json([
            'success' => true,
            'message' => 'Resep diperbarui.',
            'recipe' => $recipe
        ]);
    }

    public function destroy(string $id)
    {
        Recipe::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Resep dihapus.'
        ]);
    }
}
