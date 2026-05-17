<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CategoryController extends Controller
{
    public function index(): View
    {
        $categories = Category::withCount('menus')->latest()->paginate(20);

        return view('shared.menu-management.categories', compact('categories'));
    }

    public function create(): View
    {
        return view('shared.menu-management.category-create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        Category::create($data);

        return redirect()->route('categories.index')->with('success', 'Kategori ditambahkan.');
    }

    public function show(string $id): View
    {
        $category = Category::with('menus')->findOrFail($id);

        return view('shared.menu-management.category-show', compact('category'));
    }

    public function edit(string $id): View
    {
        $category = Category::findOrFail($id);

        return view('shared.menu-management.category-edit', compact('category'));
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        if ($category->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return redirect()->route('categories.index')->with('success', 'Kategori diperbarui.');
    }

    public function destroy(string $id)
    {
        Category::findOrFail($id)->delete();

        return redirect()->route('categories.index')->with('success', 'Kategori dihapus.');
    }
}
