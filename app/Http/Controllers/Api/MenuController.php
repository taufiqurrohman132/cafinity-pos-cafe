<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Menu;
use App\Models\TransactionItem;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']);
        $query = Menu::select(['id', 'category_id', 'name', 'slug', 'description', 'price', 'image', 'is_active'])
            ->with(['category:id,name', 'recipe:id,menu_id,total_hpp'])
            ->latest();

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

        $editMenu = null;
        if ($request->filled('edit')) {
            $editMenu = Menu::with('category')->find($request->edit);
        }

        return response()->json([
            'menus' => $menus,
            'categories' => $categories,
            'totalMenus' => $totalMenus,
            'editMenu' => $editMenu
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|integer|min:0',
            'is_active'     => 'boolean',
            'image'         => 'nullable|image|max:2048',
            'estimated_hpp' => 'nullable|integer|min:0',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menus', 'public');
        }

        $estimatedHpp = $data['estimated_hpp'] ?? null;
        unset($data['estimated_hpp']);

        $menu = Menu::create($data);

        AuditLog::record('menu.created', $menu);

        if ($estimatedHpp !== null) {
            $menu->recipe()->create([
                'total_hpp' => $estimatedHpp,
                'notes'     => 'Estimasi awal',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu ditambahkan.',
            'menu' => $menu
        ]);
    }

    public function show(string $id)
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        $menu = Menu::with([
            'category',
            'recipe.ingredients',
            'activeBundle',
            'audits.user',
        ])->findOrFail($id);

        $menu->append(['hpp', 'profit_trend', 'is_best_seller']);

        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $qty = TransactionItem::where('menu_id', $menu->id)
                ->whereHas('transaction', function ($q) use ($date) {
                    $q->where('status', 'completed')
                      ->whereDate('created_at', $date);
                })
                ->sum('qty');
            $weeklySales[] = (int) $qty;
        }

        $current7DaysQty = array_sum($weeklySales);

        $previous7DaysQty = 0;
        for ($i = 13; $i >= 7; $i--) {
            $date = now()->subDays($i)->toDateString();
            $qty = TransactionItem::where('menu_id', $menu->id)
                ->whereHas('transaction', function ($q) use ($date) {
                    $q->where('status', 'completed')
                      ->whereDate('created_at', $date);
                })
                ->sum('qty');
            $previous7DaysQty += (int) $qty;
        }

        if ($previous7DaysQty > 0) {
            $weeklyGrowth = round((($current7DaysQty - $previous7DaysQty) / $previous7DaysQty) * 100);
        } else {
            $weeklyGrowth = $current7DaysQty > 0 ? 100 : 0;
        }

        return response()->json([
            'menu'         => $menu,
            'categories'   => $categories,
            'weeklySales'  => $weeklySales,
            'weeklyGrowth' => $weeklyGrowth,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $menu = Menu::findOrFail($id);

        $data = $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|integer|min:0',
            'is_active'     => 'boolean',
            'image'         => 'nullable|image|max:2048',
            'estimated_hpp' => 'nullable|integer|min:0',
        ]);

        if ($menu->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);
        }

        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }
            $data['image'] = $request->file('image')->store('menus', 'public');
        } else {
            unset($data['image']);
        }

        $estimatedHpp = $data['estimated_hpp'] ?? null;
        unset($data['estimated_hpp']);

        $menu->update($data);

        AuditLog::record('menu.updated', $menu);

        if ($estimatedHpp !== null) {
            $menu->recipe()->updateOrCreate([], [
                'total_hpp' => $estimatedHpp,
                'notes'     => 'Estimasi awal',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu diperbarui.',
            'menu' => $menu
        ]);
    }

    public function destroy(string $id)
    {
        $menu = Menu::findOrFail($id);
        AuditLog::record('menu.deleted', $menu);
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu dihapus.'
        ]);
    }

    public function toggleStatus(string $id)
    {
        $menu = Menu::findOrFail($id);
        $menu->update(['is_active' => !$menu->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Status menu diperbarui.',
            'menu' => $menu
        ]);
    }

    public function uploadImage(Request $request, string $id)
    {
        $request->validate(['image' => 'required|image|max:2048']);

        $menu = Menu::findOrFail($id);
        $path = $request->file('image')->store('menus', 'public');
        $menu->update(['image' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Gambar berhasil diupload.',
            'image_url' => $menu->image_url
        ]);
    }
}
