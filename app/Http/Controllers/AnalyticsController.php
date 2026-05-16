<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    //
    public function index()
    {
        return view('analytics.index');
    }

    public function aov()
    {
        $aov = Transaction::avg('total_amount');
        return response()->json(['aov' => $aov]);
    }

    public function revenue()
    {
        $revenue = Transaction::selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')->get();
        return response()->json($revenue);
    }

    public function profit()
    {
        // revenue - total HPP
        return response()->json(['profit' => 0]);
    }

    public function bestSellingMenu()
    {
        $menus = TransactionItem::selectRaw('menu_id, SUM(qty) as total_sold')
            ->groupBy('menu_id')->orderByDesc('total_sold')->with('menu')->take(10)->get();
        return response()->json($menus);
    }
}
