<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $categories = Category::withCount('menus')->paginate(20);
        return view('categories.index', compact('categories'));
    }

    public function create()
    {
        return view('categories.create');
    }

    public function store(Request $request)
    {
        Category::create($request->validated());
        return redirect()->route('categories.index')->with('success', 'Kategori ditambahkan.');
    }

    public function show($id)
    {
        $category = Category::with('menus')->findOrFail($id);
        return view('categories.show', compact('category'));
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        return view('categories.edit', compact('category'));
    }

    public function update(Request $request, $id)
    {
        Category::findOrFail($id)->update($request->validated());
        return redirect()->route('categories.index')->with('success', 'Kategori diperbarui.');
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();
        return redirect()->route('categories.index')->with('success', 'Kategori dihapus.');
    }
}
