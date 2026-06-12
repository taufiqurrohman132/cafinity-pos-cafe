<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\KitchenOrder;
use App\Models\KitchenOrderItem;
use App\Models\Menu;
use App\Models\Promotion;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Notification;
use App\Events\OrderCreated;
use App\Events\LowStockTriggered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function pos()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('menus', fn($q) => $q->where('is_active', true))
            ->withCount(['menus' => fn($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get()
            ->map(fn(Category $c) => [
                'id'          => $c->id,
                'name'        => $c->name,
                'slug'        => $c->slug,
                'icon'        => $this->categoryIcon($c->name),
                'menus_count' => $c->menus_count,
            ]);

        $menus = Menu::query()
            ->where('is_active', true)
            ->with('category')
            ->orderBy('name')
            ->get()
            ->map(fn(Menu $m) => [
                'id'            => $m->id,
                'category_id'   => $m->category_id,
                'category_name' => $m->category?->name,
                'name'          => $m->name,
                'description'   => $m->description,
                'price'         => $m->price,
                'image_url'     => $m->image_url,
            ]);

        $heldOrders = Transaction::query()
            ->where('status', 'held')
            ->where('cashier_id', auth()->id())
            ->with('items.menu')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn(Transaction $tx) => [
                'id'          => $tx->id,
                'label'       => '#HOLD-' . str_pad((string) $tx->id, 4, '0', STR_PAD_LEFT),
                'total'       => $tx->total_amount,
                'items_count' => $tx->items->sum('qty'),
                'time_ago'    => $tx->created_at->diffForHumans(short: true),
            ]);

        $initialCart          = [];
        $resumedTransactionId = null;
        $heldTransaction      = session('held_transaction');

        if ($heldTransaction instanceof Transaction) {
            $heldTransaction->loadMissing('items.menu');
            $resumedTransactionId = $heldTransaction->id;

            foreach ($heldTransaction->items as $item) {
                $initialCart[] = [
                    'menu_id' => $item->menu_id,
                    'name'    => $item->menu?->name ?? 'Menu',
                    'price'   => $item->price,
                    'qty'     => $item->qty,
                    'notes'   => $item->notes ?? '',
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

        return response()->json([
            'categories'           => $categories,
            'menus'                => $menus,
            'heldOrders'           => $heldOrders,
            'initialCart'          => $initialCart,
            'resumedTransactionId' => $resumedTransactionId,
            'taxPercent'           => $taxPercent,
            'activePromotions'     => $activePromotions,
            'cashierName'          => auth()->user()->name,
            'urls'                 => [
                'checkout' => '/api/pos/checkout',
                'hold'     => '/api/pos/hold',
                'resume'   => '/api/pos/resume/__ID__',
            ],
        ]);
    }

    public function checkout(Request $request)
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

            // Reduce inventory stock based on recipes
            foreach ($lineItems as $line) {
                $menu = Menu::with('recipe.ingredients')->find($line['menu_id']);
                if ($menu && $menu->recipe) {
                    foreach ($menu->recipe->ingredients as $ingredient) {
                        $qtyNeeded = $ingredient->pivot->qty * $line['qty'];
                        $wasLow = $ingredient->isLowStock();
                        
                        // Pass negative quantity to adjustStock to decrement
                        $ingredient->adjustStock(-$qtyNeeded, 'out', "Order #{$transaction->id}");
                        
                        // Check if now low stock
                        if (!$wasLow && $ingredient->isLowStock()) {
                            event(new LowStockTriggered($ingredient));
                            
                            $admins = User::whereIn('role', ['owner', 'admin'])->get();
                            foreach ($admins as $admin) {
                                Notification::create([
                                    'user_id' => $admin->id,
                                    'title'   => 'Stok Bahan Baku Menipis',
                                    'body'    => "Bahan baku {$ingredient->name} tersisa {$ingredient->stock} {$ingredient->unit} (minimum {$ingredient->min_stock} {$ingredient->unit}).",
                                    'type'    => 'stock',
                                    'is_read' => false,
                                ]);
                            }
                        }
                    }
                }
            }

            if (!empty($data['held_transaction_id'])) {
                Transaction::query()
                    ->where('id', $data['held_transaction_id'])
                    ->whereIn('status', ['held', 'pending'])
                    ->update(['status' => 'cancelled']);
            }

            return $transaction;
        });

        // Broadcast to Kitchen
        $kitchenOrder = KitchenOrder::where('transaction_id', $transaction->id)->first();
        if ($kitchenOrder) {
            event(new OrderCreated($kitchenOrder));
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil.',
            'invoice' => $transaction->id,
            'redirect' => '/transactions/' . $transaction->id,
            'transaction' => $transaction
        ]);
    }

    public function hold(Request $request)
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

        return response()->json([
            'success' => true,
            'message' => 'Transaksi di-hold.',
            'transaction_id' => $transaction->id,
        ]);
    }

    public function resume(string $id)
    {
        $transaction = Transaction::with('items.menu')->findOrFail($id);
        $transaction->update(['status' => 'pending']);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi dilanjutkan.',
            'transaction' => $transaction
        ]);
    }

    public function cancel(string $id)
    {
        Transaction::findOrFail($id)->update(['status' => 'cancelled']);
        return response()->json([
            'success' => true,
            'message' => 'Transaksi dibatalkan.'
        ]);
    }

    public function index(Request $request)
    {
        return $this->history($request);
    }

    public function history(Request $request)
    {
        $query = Transaction::with(['cashier', 'items'])->latest();

        if ($request->filled('search')) {
            $query->where('id', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('method')) {
            $query->where('payment_method', $request->method);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $transactions = $query->paginate(20)->withQueryString();

        $filterDate       = $request->filled('date') ? $request->date : today()->toDateString();
        $statsQuery       = Transaction::whereDate('created_at', $filterDate);
        $totalRevenue     = (clone $statsQuery)->where('status', 'completed')->sum('total_amount');
        $totalTransactions = (clone $statsQuery)->whereIn('status', ['completed', 'pending'])->count();
        $avgOrder         = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;
        $totalRefundCancel = (clone $statsQuery)->whereIn('status', ['refunded', 'cancelled'])->count();

        return response()->json([
            'transactions'      => $transactions,
            'filters'           => $request->only(['search', 'status', 'method', 'date']),
            'stats'             => [
                'total_revenue'      => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'avg_order'          => $avgOrder,
                'total_refund_cancel' => $totalRefundCancel,
            ],
        ]);
    }

    public function show(string $id)
    {
        $transaction = Transaction::with(['items.menu', 'cashier', 'kitchenOrder.items'])->findOrFail($id);
        return response()->json([
            'transaction' => $transaction,
        ]);
    }

    public function invoice(string $id)
    {
        $transaction = Transaction::with(['items.menu', 'cashier'])->findOrFail($id);
        return response()->json([
            'transaction' => $transaction,
        ]);
    }

    public function print(string $id)
    {
        $transaction = Transaction::with('items.menu')->findOrFail($id);
        return response()->json(['status' => 'printed', 'transaction' => $transaction]);
    }

    public function refund(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        if ($transaction->status === 'refunded') {
            return response()->json(['message' => 'Transaksi sudah di-refund.'], 400);
        }
        $transaction->update(['status' => 'refunded']);
        return response()->json([
            'success' => true,
            'message' => 'Refund berhasil.',
            'transaction' => $transaction
        ]);
    }

    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $data = $request->validate([
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:pending,held,completed,cancelled,refunded',
        ]);
        
        $transaction->update($data);
        
        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui.',
            'transaction' => $transaction->load(['items.menu', 'cashier'])
        ]);
    }


    private function categoryIcon(string $name): string
    {
        $lower = strtolower($name);
        return match (true) {
            str_contains($lower, 'kopi'), str_contains($lower, 'coffee') => 'solar:cup-hot-bold',
            str_contains($lower, 'non')                                  => 'solar:cup-star-linear',
            str_contains($lower, 'makanan'), str_contains($lower, 'main') => 'solar:plate-linear',
            str_contains($lower, 'snack'), str_contains($lower, 'cemilan') => 'solar:donut-linear',
            default                                                       => 'solar:widget-linear',
        };
    }

    public function export(Request $request)
    {
        $query = Transaction::with(['cashier', 'items'])
            ->when($request->filled('search'), fn($q) => $q->where('id', 'like', '%' . $request->search . '%'))
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('method'), fn($q) => $q->where('payment_method', $request->method))
            ->when($request->filled('date'),   fn($q) => $q->whereDate('created_at', $request->date))
            ->latest()
            ->get();

        $filename = 'transaksi_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($query) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($handle, [
                'ID Invoice',
                'Tanggal',
                'Waktu',
                'Kasir',
                'Total Item',
                'Total Tagihan',
                'Metode Pembayaran',
                'Status',
            ]);

            foreach ($query as $trx) {
                fputcsv($handle, [
                    $trx->id,
                    $trx->created_at->format('d/m/Y'),
                    $trx->created_at->format('H:i'),
                    $trx->cashier->name ?? '-',
                    $trx->items->sum('qty'),
                    $trx->total_amount,
                    strtoupper($trx->payment_method),
                    $trx->status,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
