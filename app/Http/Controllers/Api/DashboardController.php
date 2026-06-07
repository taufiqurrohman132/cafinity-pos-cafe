<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get dashboard metrics dynamically based on authenticated user's role.
     */
    public function index(Request $request)
    {
        $data = $this->dashboardService->getDataForUser($request->user());
        return response()->json($data);
    }

    /**
     * Get owner sales chart metrics for a given period.
     */
    public function salesChart(Request $request)
    {
        // Simple authorization check for owner role
        if ($request->user()->role !== 'owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $period = $request->get('period', 'today');
        $data = $this->dashboardService->getSalesChartData($period);
        
        return response()->json($data);
    }
}
