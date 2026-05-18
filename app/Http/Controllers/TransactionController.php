<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\KitchenOrder;
use App\Models\KitchenOrderItem;
use App\Models\Menu;
use App\Models\Promotion;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class TransactionController extends Controller
{
    public function pos(): View
    {
        $placeholderImage = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop';

        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('menus', fn ($q) => $q->where('is_active', true))
            ->withCount(['menus' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $this->categoryIcon($category->name),
                'menus_count' => $category->menus_count,
            ]);

        $menus = Menu::query()
            ->where('is_active', true)
            ->with('category')
            ->orderBy('name')
            ->get()
            ->map(fn (Menu $menu) => [
                'id' => $menu->id,
                'category_id' => $menu->category_id,
                'category_name' => $menu->category?->name,
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => $menu->price,
                'image_url' => $menu->image
                    ? Storage::disk('public')->url($menu->image)
                    : $placeholderImage,
            ]);

        $heldOrders = Transaction::query()
            ->where('status', 'held')
            ->where('cashier_id', auth()->id())
            ->with('items.menu')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Transaction $tx) => [
                'id' => $tx->id,
                'label' => '#HOLD-'.str_pad((string) $tx->id, 4, '0', STR_PAD_LEFT),
                'total' => $tx->total_amount,
                'items_count' => $tx->items->sum('qty'),
                'time_ago' => $tx->created_at->diffForHumans(short: true),
            ]);

        $initialCart = [];
        $resumedTransactionId = null;
        $heldTransaction = session('held_transaction');

        if ($heldTransaction instanceof Transaction) {
            $heldTransaction->loadMissing('items.menu');
            $resumedTransactionId = $heldTransaction->id;

            foreach ($heldTransaction->items as $item) {
                $initialCart[] = [
                    'menu_id' => $item->menu_id,
                    'name' => $item->menu?->name ?? 'Menu',
                    'price' => $item->price,
                    'qty' => $item->qty,
                    'notes' => $item->notes ?? '',
                ];
            }

            session()->forget('held_transaction');
        }

        $taxPercent = (int) (Setting::where('key', 'tax_percent')->value('value') ?? 10);

        $activePromotions = Promotion::query()
            ->where('is_active', true)
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'value', 'min_purchase']);

        return view('shared.pos.index', [
            'categories' => $categories,
            'menus' => $menus,
            'heldOrders' => $heldOrders,
            'initialCart' => $initialCart,
            'resumedTransactionId' => $resumedTransactionId,
            'taxPercent' => $taxPercent,
            'activePromotions' => $activePromotions,
            'cashierName' => auth()->user()->name,
        ]);
    }

    public function checkout(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'items'               => 'required|array|min:1',
            'items.*.menu_id'     => 'required|exists:menus,id',
            'items.*.qty'         => 'required|integer|min:1',
            'items.*.notes'       => 'nullable|string',
            'discount'            => 'nullable|integer|min:0',
            'tax'                 => 'nullable|integer|min:0',
            'payment_method'      => 'nullable|string|max:50',
            'paid_amount'         => 'nullable|integer|min:0',
            'notes'               => 'nullable|string',
            'held_transaction_id' => 'nullable|exists:transactions,id',
        ]);

        $transaction = DB::transaction(function () use ($data) {
            $subtotal = 0;
            $lineItems = [];

            foreach ($data['items'] as $item) {
                $menu = Menu::findOrFail($item['menu_id']);
                $price = $menu->price;
                $lineSubtotal = $price * $item['qty'];
                $subtotal += $lineSubtotal;

                $lineItems[] = [
                    'menu_id'  => $menu->id,
                    'qty'      => $item['qty'],
                    'price'    => $price,
                    'discount' => 0,
                    'subtotal' => $lineSubtotal,
                    'notes'    => $item['notes'] ?? null,
                ];
            }

            $discount = $data['discount'] ?? 0;
            $tax = $data['tax'] ?? 0;
            $total = max(0, $subtotal - $discount + $tax);
            $paid = $data['paid_amount'] ?? $total;

            $transaction = Transaction::create([
                'cashier_id'     => auth()->id(),
                'status'         => 'completed',
                'total_amount'   => $total,
                'discount'       => $discount,
                'tax'            => $tax,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'paid_amount'    => $paid,
                'change_amount'  => max(0, $paid - $total),
                'notes'          => $data['notes'] ?? null,
            ]);

            foreach ($lineItems as $line) {
                $transaction->items()->create($line);
            }

            $kitchenOrder = KitchenOrder::create([
                'transaction_id' => $transaction->id,
                'status'         => 'pending',
            ]);

            foreach ($lineItems as $line) {
                KitchenOrderItem::create([
                    'kitchen_order_id' => $kitchenOrder->id,
                    'menu_id'          => $line['menu_id'],
                    'qty'              => $line['qty'],
                    'notes'            => $line['notes'],
                ]);
            }

            if (! empty($data['held_transaction_id'])) {
                Transaction::query()
                    ->where('id', $data['held_transaction_id'])
                    ->where('status', 'held')
                    ->update(['status' => 'cancelled']);
            }

            return $transaction;
        });

        if ($request->expectsJson()) {
            return response()->json([
                'invoice' => $transaction->id,
                'redirect' => route('transactions.show', $transaction->id),
            ]);
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Transaksi berhasil.');
    }

    public function hold(Request $request): JsonResponse|RedirectResponse
    {
        $data = $request->validate([
            'items'           => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.qty'     => 'required|integer|min:1',
            'notes'           => 'nullable|string',
        ]);

        $subtotal = 0;

        foreach ($data['items'] as $item) {
            $menu = Menu::findOrFail($item['menu_id']);
            $subtotal += $menu->price * $item['qty'];
        }

        $transaction = Transaction::create([
            'cashier_id'   => auth()->id(),
            'status'       => 'held',
            'total_amount' => $subtotal,
            'notes'        => $data['notes'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $menu = Menu::findOrFail($item['menu_id']);
            $transaction->items()->create([
                'menu_id'  => $menu->id,
                'qty'      => $item['qty'],
                'price'    => $menu->price,
                'subtotal' => $menu->price * $item['qty'],
            ]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Transaksi di-hold.',
                'transaction_id' => $transaction->id,
            ]);
        }

        return back()->with('success', 'Transaksi di-hold.');
    }

    public function resume(string $id)
    {
        $transaction = Transaction::with('items.menu')->findOrFail($id);
        $transaction->update(['status' => 'pending']);

        return redirect()->route('pos.index')->with('held_transaction', $transaction);
    }

    public function cancel(string $id)
    {
        Transaction::findOrFail($id)->update(['status' => 'cancelled']);

        return back()->with('success', 'Transaksi dibatalkan.');
    }

    public function history(): View
    {
        $transactions = Transaction::with('cashier')->latest()->paginate(20);

        return view('shared.transaction.index', compact('transactions'));
    }

    public function show(string $id): View
    {
        $transaction = Transaction::with(['items.menu', 'cashier', 'kitchenOrder.items'])->findOrFail($id);

        return view('shared.transaction.show', compact('transaction'));
    }

    public function invoice(string $id): View
    {
        $transaction = Transaction::with(['items.menu', 'cashier'])->findOrFail($id);

        return view('shared.transaction.invoice', compact('transaction'));
    }

    public function print(string $id)
    {
        $transaction = Transaction::with('items.menu')->findOrFail($id);

        return response()->json([
            'status'      => 'printed',
            'transaction' => $transaction,
        ]);
    }

    public function refund(string $id)
    {
        $transaction = Transaction::findOrFail($id);

        if ($transaction->status === 'refunded') {
            return back()->with('error', 'Transaksi sudah di-refund.');
        }

        $transaction->update(['status' => 'refunded']);

        return back()->with('success', 'Refund berhasil.');
    }

    private function categoryIcon(string $name): string
    {
        $lower = strtolower($name);

        return match (true) {
            str_contains($lower, 'kopi'), str_contains($lower, 'coffee') => 'solar:cup-hot-bold',
            str_contains($lower, 'non') => 'solar:cup-star-linear',
            str_contains($lower, 'makanan'), str_contains($lower, 'main') => 'solar:plate-linear',
            str_contains($lower, 'snack'), str_contains($lower, 'cemilan') => 'solar:donut-linear',
            default => 'solar:widget-linear',
        };
    }
}
