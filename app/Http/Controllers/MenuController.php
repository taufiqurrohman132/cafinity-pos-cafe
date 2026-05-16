<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::with('category')->paginate(20);
        return view('menus.index', compact('menus'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('menus.create', compact('categories'));
    }

    public function store(Request $request)
    {
        Menu::create($request->validated());
        return redirect()->route('menus.index')->with('success', 'Menu ditambahkan.');
    }

    public function show($id)
    {
        $menu = Menu::with('category', 'recipe')->findOrFail($id);
        return view('menus.show', compact('menu'));
    }

    public function edit($id)
    {
        $menu = Menu::findOrFail($id);
        $categories = Category::all();
        return view('menus.edit', compact('menu', 'categories'));
    }

    public function update(Request $request, $id)
    {
        Menu::findOrFail($id)->update($request->validated());
        return redirect()->route('menus.index')->with('success', 'Menu diperbarui.');
    }

    public function destroy($id)
    {
        Menu::findOrFail($id)->delete();
        return redirect()->route('menus.index')->with('success', 'Menu dihapus.');
    }

    public function toggleStatus($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->update(['is_active' => !$menu->is_active]);
        return back();
    }

    public function uploadImage(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);
        $path = $request->file('image')->store('menus', 'public');
        $menu->update(['image' => $path]);
        return back()->with('success', 'Gambar berhasil diupload.');
    }
}
