<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierDashboardController extends Controller
{
    //
    public function index(): Response
    {
        return Inertia::render('Dashboard/Cashier/Index', [
            'user'               => auth()->user(),
            'stats'              => $this->getStats(),
            'recentTransactions' => $this->getRecentTransactions(),
            'lowStockItems'      => $this->getLowStockItems(),
            'shiftInfo'          => $this->getShiftInfo(),
        ]);
    }
}
