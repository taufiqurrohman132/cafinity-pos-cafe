<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RecipeController extends Controller
{
    public function index(): View
    {
        $recipes = Recipe::with(['menu', 'ingredients'])->latest()->paginate(20);

        return view('shared.recipe-costiong.index', compact('recipes'));
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

        $sync = collect($data['ingredients'])->mapWithKeys(fn ($row) => [
            $row['inventory_id'] => [
                'qty'  => $row['qty'],
                'unit' => $row['unit'],
            ],
        ])->all();

        $recipe->ingredients()->sync($sync);

        return redirect()->route('recipe.index')->with('success', 'Resep ditambahkan.');
    }

    public function show(string $id): View
    {
        $recipe = Recipe::with(['menu', 'ingredients'])->findOrFail($id);

        return view('shared.recipe-costiong.show', compact('recipe'));
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

        $sync = collect($data['ingredients'])->mapWithKeys(fn ($row) => [
            $row['inventory_id'] => [
                'qty'  => $row['qty'],
                'unit' => $row['unit'],
            ],
        ])->all();

        $recipe->ingredients()->sync($sync);

        return redirect()->route('recipe.index')->with('success', 'Resep diperbarui.');
    }

    public function destroy(string $id)
    {
        Recipe::findOrFail($id)->delete();

        return redirect()->route('recipe.index')->with('success', 'Resep dihapus.');
    }
}
