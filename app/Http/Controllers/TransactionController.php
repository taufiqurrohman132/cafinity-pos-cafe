<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    //
    public function pos()
    {
        return view('shared.pos.index');
    }

    public function history()
    {
        // $transactions = Transaction::latest()->get();

        // return view('shared.transaction.index', compact('transactions'));
        return view('shared.transaction.index');
    }

    public function show($id)
    {
        // return view('shared.transactions.show');
    }

    public function checkout()
    {
        //
    }
}
