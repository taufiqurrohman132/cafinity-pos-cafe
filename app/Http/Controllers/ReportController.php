<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Target;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    //
    public function index()
    {
        return view('reports.index');
    }

    public function sales()
    {
        $data = Transaction::whereMonth('created_at', now()->month)->get();
        return view('reports.sales', compact('data'));
    }

    public function inventory()
    {
        $data = Inventory::all();
        return view('reports.inventory', compact('data'));
    }

    public function daily()
    {
        $data = Transaction::whereDate('created_at', today())->get();
        return view('reports.daily', compact('data'));
    }

    public function monthly()
    {
        $data = Transaction::whereMonth('created_at', now()->month)->get();
        return view('reports.monthly', compact('data'));
    }

    public function profitLoss()
    {
        // kalkulasi revenue - HPP
        return view('reports.profit-loss');
    }

    public function exportPdf()
    {
        // generate PDF pakai DomPDF / Barryvdh
        return response()->download('report.pdf');
    }

    // public function exportExcel()
    // {
    //     // generate Excel pakai Maatwebsite
    //     return Excel::download(new ReportExport, 'report.xlsx');
    // }

    public function targetsGoals()
    {
        $targets = Target::all();
        return view('reports.targets-goals', compact('targets'));
    }

    public function storeTarget(Request $request)
    {
        Target::create($request->validated());
        return back()->with('success', 'Target ditambahkan.');
    }

    public function updateTarget(Request $request, $id)
    {
        Target::findOrFail($id)->update($request->validated());
        return back()->with('success', 'Target diperbarui.');
    }

    public function destroyTarget($id)
    {
        Target::findOrFail($id)->delete();
        return back()->with('success', 'Target dihapus.');
    }
}
