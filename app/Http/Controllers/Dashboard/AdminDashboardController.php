<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    //

    public function index(): Response
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'user'        => auth()->user(),
            'stats'       => $this->getStats(),
            'hppAnalysis' => $this->profitabilityAnalysis(),
            'activityLog' => [],
            'stockMovement' => [],
            'menuSummary'   => [],
        ]);
    }
}
