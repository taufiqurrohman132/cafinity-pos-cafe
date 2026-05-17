<?php

namespace App\Http\Controllers;

use App\Models\KitchenOrder;
use App\Models\KitchenOrderItem;
use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class TransactionController extends Controller
{
    public function pos(): View
    {
        $menus = Menu::where('is_active', true)->with('category')->orderBy('name')->get();

        return view('shared.pos.index', compact('menus'));
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

            return $transaction;
        });

        if ($request->expectsJson()) {
            return response()->json(['invoice' => $transaction->id]);
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Transaksi berhasil.');
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
}
