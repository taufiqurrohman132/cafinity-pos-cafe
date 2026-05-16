<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    //
    public function pos()
    {
        $menus = Menu::where('is_active', true)->with('category')->get();
        return view('pos.index', compact('menus'));
    }

    public function checkout(Request $request)
    {
        $transaction = Transaction::create(['status' => 'completed', 'notes' => $request->input('notes')]);
        // kurangi stok, generate invoice
        return response()->json(['invoice' => $transaction->id]);
    }

    public function hold(Request $request)
    {
        Transaction::create(['status' => 'held', 'notes' => $request->input('notes')]);
        return back()->with('success', 'Transaksi di-hold.');
    }

    public function resume($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => 'pending']);
        return redirect()->route('pos.index');
    }

    public function cancel($id)
    {
        Transaction::findOrFail($id)->update(['status' => 'cancelled']);
        return back()->with('success', 'Transaksi dibatalkan.');
    }

    public function history()
    {
        $transactions = Transaction::latest()->paginate(20);
        return view('transactions.index', compact('transactions'));
    }

    public function show($id)
    {
        $transaction = Transaction::with('items')->findOrFail($id);
        return view('transactions.show', compact('transaction'));
    }

    public function invoice($id)
    {
        $transaction = Transaction::with('items')->findOrFail($id);
        return view('transactions.invoice', compact('transaction'));
    }

    public function print($id)
    {
        // trigger print / generate PDF
        return response()->json(['status' => 'printed']);
    }

    public function refund($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => 'refunded']);
        // kembalikan stok
        return back()->with('success', 'Refund berhasil.');
    }
}
