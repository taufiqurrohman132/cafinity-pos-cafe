<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\TransactionItem;
use App\Models\AuditLog;
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

        $editMenu = null;
        if ($request->filled('edit')) {
            $editMenu = Menu::with('category')->find($request->edit);
        }

        return Inertia::render('Menus/Index', compact('menus', 'categories', 'totalMenus', 'editMenu'));
    }

    public function create()
    {
        $this->authorize('manage-menu');
        return redirect()->route('menus.index', ['create' => 1]);
    }

    public function store(Request $request)
    {
        $this->authorize('manage-menu');

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

        return redirect()->route('menus.index')->with('success', 'Menu ditambahkan.');
    }

    /**
     * Sebelumnya: return view('shared.menu-management.show', ...)
     * Sekarang: Inertia render ke Menus/Show
     */
    public function show(string $id): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        $menu = Menu::with([
            'category',
            'recipe.ingredients', // pivot: quantity, cost
            'activeBundle',       // relasi promo aktif
            'audits.user',        // riwayat perubahan
        ])->findOrFail($id);

        // Append computed attributes ke dalam JSON
        $menu->append(['hpp', 'profit_trend', 'is_best_seller']);

        // Data penjualan mingguan — dihitung dari data transaksi riil
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

        return Inertia::render('Menus/Show', [
            'menu'         => $menu,
            'categories'   => $categories,
            'weeklySales'  => $weeklySales,
            'weeklyGrowth' => $weeklyGrowth,
        ]);
    }

    public function edit(string $id)
    {
        $this->authorize('manage-menu');
        return redirect()->route('menus.index', ['edit' => $id]);
    }

    public function update(Request $request, string $id)
    {
        $this->authorize('manage-menu');

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
                \Illuminate\Support\Facades\Storage::disk('public')->delete($menu->image);
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

        if ($request->header('referer') && str_contains($request->header('referer'), route('menus.show', $menu->id))) {
            return redirect()->route('menus.show', $menu->id)->with('success', 'Menu diperbarui.');
        }

        return redirect()->route('menus.index')->with('success', 'Menu diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->authorize('manage-menu');

        $menu = Menu::findOrFail($id);
        AuditLog::record('menu.deleted', $menu);
        $menu->delete();

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