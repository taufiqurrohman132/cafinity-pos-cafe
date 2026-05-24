<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Target;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): View
    {
        return view('shared.reports.index'); // ← fix: was reports-analytics.index
    }

    public function sales(): View
    {
        $data = Transaction::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->with('cashier')
            ->get();

        return view('shared.reports.sales', compact('data'));
    }

    public function inventory(): View
    {
        $data = Inventory::with(['category', 'supplier'])->get();

        return view('shared.reports.inventory', compact('data'));
    }

    public function daily(): View
    {
        $data = Transaction::whereDate('created_at', today())
            ->with('cashier')
            ->get();

        return view('shared.reports.daily', compact('data'));
    }

    public function monthly(): View
    {
        $data = Transaction::whereMonth('created_at', now()->month)
            ->with('cashier')
            ->get();

        return view('shared.reports.monthly', compact('data'));
    }

    public function profitLoss(): View
    {
        $revenue = Transaction::where('status', 'completed')->sum('total_amount');
        $transactions = Transaction::where('status', 'completed')->count();

        return view('shared.reports.profit-loss', compact('revenue', 'transactions'));
    }

    // ── Analytics (dipindah dari AnalyticsController) ──────────────────────

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

        $hpp = TransactionItem::whereHas('transaction', fn($q) => $q->where('status', 'completed'))
            ->with('menu.recipe.ingredients')
            ->get()
            ->sum(function ($item) {
                $recipe = $item->menu?->recipe;
                if (!$recipe) return 0;
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

    // ── Export ──────────────────────────────────────────────────────────────

    public function exportPdf()
    {
        return back()->with('info', 'Export PDF belum dikonfigurasi (DomPDF).');
    }

    public function exportExcel(): StreamedResponse
    {
        $transactions = Transaction::where('status', 'completed')->latest()->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="report-' . now()->format('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($transactions) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Kasir', 'Total', 'Status', 'Tanggal']);

            foreach ($transactions as $tx) {
                fputcsv($handle, [
                    $tx->id,
                    $tx->cashier?->name,
                    $tx->total_amount,
                    $tx->status,
                    $tx->created_at,
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}