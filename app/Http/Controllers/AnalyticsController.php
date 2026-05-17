<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class AnalyticsController extends Controller
{
    public function index(): View
    {
        return view('shared.reports-analytics.index');
    }

    public function aov(): JsonResponse
    {
        $aov = Transaction::where('status', 'completed')->avg('total_amount') ?? 0;

        return response()->json(['aov' => round($aov, 2)]);
    }

    public function revenue(): JsonResponse
    {
        $revenue = Transaction::where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($revenue);
    }

    public function profit(): JsonResponse
    {
        $revenue = Transaction::where('status', 'completed')->sum('total_amount');

        $hpp = TransactionItem::whereHas('transaction', fn ($q) => $q->where('status', 'completed'))
            ->with('menu.recipe.ingredients')
            ->get()
            ->sum(function ($item) {
                $recipe = $item->menu?->recipe;

                if (! $recipe) {
                    return 0;
                }

                return $recipe->total_hpp * $item->qty;
            });

        return response()->json(['profit' => max(0, $revenue - $hpp)]);
    }

    public function bestSellingMenu(): JsonResponse
    {
        $menus = TransactionItem::selectRaw('menu_id, SUM(qty) as total_sold')
            ->groupBy('menu_id')
            ->orderByDesc('total_sold')
            ->with('menu')
            ->take(10)
            ->get();

        return response()->json($menus);
    }
}
