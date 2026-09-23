<?php

namespace Tests\Feature\Api;

use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(string $role): void
    {
        $this->apiAs($this->makeUser($role));
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $this->getJson('/api/dashboard')->assertStatus(401);
        $this->getJson('/api/dashboard/sales-chart')->assertStatus(401);
    }

    public function test_owner_dashboard_returns_owner_structure(): void
    {
        $this->actingAsRole('owner');
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 100000]);

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'lastUpdated',
                'stats' => ['revenue', 'profit', 'orders', 'avg_ticket'],
                'salesChart',
                'bestSellingMenus',
                'busyHours',
                'profitability',
                'dailyGoal',
                'currentTarget',
                'lowStockItems',
                'kitchenQueue',
            ]);
    }

    public function test_admin_dashboard_returns_admin_structure(): void
    {
        $this->actingAsRole('admin');

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'stats' => ['low_stock', 'pending_po', 'total_sku', 'inventory_val'],
                'hppAnalysis',
                'activityLog',
                'stockMovement',
                'menuSummary',
            ]);
    }

    public function test_cashier_dashboard_returns_cashier_structure(): void
    {
        $this->actingAsRole('cashier');
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 75000]);

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'stats' => ['total_orders', 'total_cash', 'avg_time'],
                'recentTransactions',
                'lowStockItems',
                'shiftInfo',
            ]);
    }

    public function test_sales_chart_available_for_owner_only(): void
    {
        $this->actingAsRole('owner');

        $this->getJson('/api/dashboard/sales-chart?period=7days')
            ->assertOk()
            ->assertJsonStructure(['labels', 'values', 'max'])
            ->assertJsonCount(7, 'labels')
            ->assertJsonCount(7, 'values');

        $this->getJson('/api/dashboard/sales-chart')
            ->assertOk()
            ->assertJsonCount(24, 'labels');
    }

    public function test_sales_chart_forbidden_for_non_owner(): void
    {
        $this->actingAsRole('cashier');

        $this->getJson('/api/dashboard/sales-chart')
            ->assertStatus(403)
            ->assertJsonPath('message', 'Unauthorized');
    }
}
