<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        $query = Menu::with(['category', 'recipe'])->latest();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $menus = $query->paginate(20)->withQueryString();
        $totalMenus = Menu::count();

        return Inertia::render('Menus/Index', compact('menus', 'categories', 'totalMenus'));
    }

    public function create(): View
    {
        $this->authorize('manage-menu');

        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return view('shared.menu-management.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $this->authorize('manage-menu');

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'image'       => 'nullable|image|max:2048',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menus', 'public');
        }

        Menu::create($data);

        return redirect()->route('menus.index')->with('success', 'Menu ditambahkan.');
    }

    /**
     * Sebelumnya: return view('shared.menu-management.show', ...)
     * Sekarang: Inertia render ke Menus/Show
     */
    public function show(string $id): Response
    {
        $menu = Menu::with([
            'category',
            'recipe.ingredients', // pivot: quantity, cost
            'activeBundle',       // relasi promo aktif
        ])->findOrFail($id);

        // Append computed attributes ke dalam JSON
        $menu->append(['hpp', 'profit_trend', 'is_best_seller']);

        // Data penjualan mingguan — sesuaikan dengan implementasi sales Anda
        // Contoh: ambil dari SalesLog atau hardcode sementara
        $weeklySales  = null; // ganti dengan: SalesLog::weeklyFor($menu->id)
        $weeklyGrowth = null; // ganti dengan: angka persentase pertumbuhan

        return Inertia::render('Menus/Show', [
            'menu'         => $menu,
            'weeklySales'  => $weeklySales,
            'weeklyGrowth' => $weeklyGrowth,
        ]);
    }

    public function edit(string $id): View
    {
        $this->authorize('manage-menu');

        $menu = Menu::findOrFail($id);
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return view('shared.menu-management.edit', compact('menu', 'categories'));
    }

    public function update(Request $request, string $id)
    {
        $this->authorize('manage-menu');

        $menu = Menu::findOrFail($id);

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
        ]);

        if ($menu->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);
        }

        $menu->update($data);

        return redirect()->route('menus.index')->with('success', 'Menu diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->authorize('manage-menu');

        Menu::findOrFail($id)->delete();

        return redirect()->route('menus.index')->with('success', 'Menu dihapus.');
    }

    public function toggleStatus(string $id)
    {
        $this->authorize('manage-menu');

        $menu = Menu::findOrFail($id);
        $menu->update(['is_active' => ! $menu->is_active]);

        return back();
    }

    public function uploadImage(Request $request, string $id)
    {
        $this->authorize('manage-menu');

        $request->validate(['image' => 'required|image|max:2048']);

        $menu = Menu::findOrFail($id);
        $path = $request->file('image')->store('menus', 'public');
        $menu->update(['image' => $path]);

        return back()->with('success', 'Gambar berhasil diupload.');
    }
}