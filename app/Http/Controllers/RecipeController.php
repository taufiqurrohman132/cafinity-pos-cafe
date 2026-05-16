<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    //
    public function index()
    {
        $recipes = Recipe::with('menu', 'ingredients')->paginate(20);
        return view('recipe-costing.index', compact('recipes'));
    }

    public function store(Request $request)
    {
        $recipe = Recipe::create($request->validated());
        $recipe->ingredients()->sync($request->ingredients);
        return redirect()->route('recipe.index')->with('success', 'Resep ditambahkan.');
    }

    public function show($id)
    {
        $recipe = Recipe::with('menu', 'ingredients')->findOrFail($id);
        return view('recipe-costing.show', compact('recipe'));
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->update($request->validated());
        $recipe->ingredients()->sync($request->ingredients);
        return redirect()->route('recipe.index')->with('success', 'Resep diperbarui.');
    }

    public function destroy($id)
    {
        Recipe::findOrFail($id)->delete();
        return redirect()->route('recipe.index')->with('success', 'Resep dihapus.');
    }
}
