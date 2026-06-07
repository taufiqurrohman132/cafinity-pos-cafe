<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('menus')->latest()->paginate(20);
        return response()->json([
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Kategori ditambahkan.',
            'category' => $category
        ]);
    }

    public function show(string $id)
    {
        $category = Category::with('menus')->findOrFail($id);
        return response()->json([
            'category' => $category
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Kategori diperbarui.',
            'category' => $category
        ]);
    }

    public function destroy(string $id)
    {
        Category::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Kategori dihapus.'
        ]);
    }
}
