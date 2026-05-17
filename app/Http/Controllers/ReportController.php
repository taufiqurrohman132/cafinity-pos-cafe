<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Target;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): View
    {
        return view('shared.reports-analytics.index');
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

    public function exportPdf()
    {
        return back()->with('info', 'Export PDF belum dikonfigurasi (DomPDF).');
    }

    public function exportExcel(): StreamedResponse
    {
        $transactions = Transaction::where('status', 'completed')->latest()->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="report-'.now()->format('Y-m-d').'.csv"',
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

    public function targetsGoals(): View
    {
        $targets = Target::latest()->get();

        return view('shared.reports.targets-goals', compact('targets'));
    }

    public function storeTarget(Request $request)
    {
        Target::create($request->validate([
            'label'         => 'required|string|max:255',
            'type'          => 'required|in:revenue,orders,profit',
            'target_value'  => 'required|integer|min:1',
            'current_value' => 'nullable|integer|min:0',
            'period'        => 'required|in:daily,weekly,monthly',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
        ]));

        return back()->with('success', 'Target ditambahkan.');
    }

    public function updateTarget(Request $request, string $id)
    {
        Target::findOrFail($id)->update($request->validate([
            'label'         => 'required|string|max:255',
            'type'          => 'required|in:revenue,orders,profit',
            'target_value'  => 'required|integer|min:1',
            'current_value' => 'nullable|integer|min:0',
            'period'        => 'required|in:daily,weekly,monthly',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
        ]));

        return back()->with('success', 'Target diperbarui.');
    }

    public function destroyTarget(string $id)
    {
        Target::findOrFail($id)->delete();

        return back()->with('success', 'Target dihapus.');
    }
}
