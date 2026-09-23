<?php

namespace Tests\Feature\Api;

use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_reports(): void
    {
        $this->getJson('/api/reports')->assertStatus(401);
        $this->getJson('/api/reports/inventory')->assertStatus(401);
        $this->getJson('/api/reports/profit-loss')->assertStatus(401);
    }

    public function test_index_returns_summary_with_charts_and_filters(): void
    {
        $this->actingAsOwner();
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 50000]);

        $this->getJson('/api/reports')
            ->assertOk()
            ->assertJsonStructure([
                'totalRevenue',
                'totalOrders',
                'avgTransaction',
                'totalProfit',
                'chartLabels',
                'chartRevenue',
                'chartProfit',
                'busySlots',
                'recentReports',
                'filterKasir',
                'filterKategori',
                'filterPayments',
            ])
            ->assertJsonPath('totalRevenue', 50000)
            ->assertJsonPath('totalOrders', 1)
            ->assertJsonCount(7, 'chartLabels')
            // log akses laporan tercatat & ditampilkan
            ->assertJsonCount(1, 'recentReports')
            ->assertJsonPath('recentReports.0.label', 'Ringkasan Laporan');
    }

    public function test_index_respects_days_and_date_range(): void
    {
        $this->actingAsOwner();
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 50000]);
        Transaction::factory()->create([
            'status' => 'completed',
            'total_amount' => 99999,
            'created_at' => now()->subDays(10),
        ]);

        $this->getJson('/api/reports?days=3')
            ->assertOk()
            ->assertJsonCount(3, 'chartLabels')
            ->assertJsonPath('days', 3);

        // rentang 2 hari terakhir: transaksi 10 hari lalu ikut kehitung?
        $this->getJson('/api/reports?start_date=' . now()->subDays(2)->toDateString())
            ->assertOk()
            ->assertJsonPath('totalRevenue', 50000);
    }

    public function test_index_can_filter_by_cashier_and_payment_method(): void
    {
        $this->actingAsOwner();
        $cashier = $this->makeUser('cashier');
        Transaction::factory()->create([
            'status' => 'completed',
            'cashier_id' => $cashier->id,
            'payment_method' => 'qris',
            'total_amount' => 30000,
        ]);
        Transaction::factory()->create([
            'status' => 'completed',
            'payment_method' => 'cash',
            'total_amount' => 20000,
        ]);

        $this->getJson("/api/reports?kasir_id={$cashier->id}")
            ->assertOk()
            ->assertJsonPath('totalRevenue', 30000);

        $this->getJson('/api/reports?payment_method=cash')
            ->assertOk()
            ->assertJsonPath('totalRevenue', 20000);
    }

    public function test_sales_daily_monthly_reports_return_transactions(): void
    {
        $this->actingAsOwner();
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 40000]);
        Transaction::factory()->create(['status' => 'held', 'total_amount' => 10000]);

        $this->getJson('/api/reports/sales')
            ->assertOk()
            ->assertJsonStructure(['transactions', 'total_revenue', 'total_orders', 'period'])
            ->assertJsonPath('total_orders', 1);

        $this->getJson('/api/reports/daily')
            ->assertOk()
            ->assertJsonStructure(['transactions', 'total_revenue', 'total_orders', 'date'])
            ->assertJsonPath('total_revenue', 40000);

        $this->getJson('/api/reports/monthly')
            ->assertOk()
            ->assertJsonStructure(['transactions', 'total_revenue', 'period']);
    }

    public function test_inventory_report_summarizes_stock(): void
    {
        $this->actingAsOwner();
        Inventory::factory()->create(['stock' => 2, 'min_stock' => 5, 'price_per_unit' => 1000]);
        Inventory::factory()->create(['stock' => 50, 'min_stock' => 5, 'price_per_unit' => 2000]);

        $this->getJson('/api/reports/inventory')
            ->assertOk()
            ->assertJsonStructure(['inventories', 'total_items', 'low_stock', 'total_value'])
            ->assertJsonPath('total_items', 2)
            ->assertJsonPath('low_stock', 1);
    }

    public function test_profit_loss_report_calculates_hpp_and_margin(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create(['price' => 20000]);
        Recipe::factory()->create(['menu_id' => $menu->id, 'total_hpp' => 5000]);

        $transaction = Transaction::factory()->create(['status' => 'completed', 'total_amount' => 40000]);
        $transaction->items()->create([
            'menu_id' => $menu->id,
            'qty' => 2,
            'price' => 20000,
            'discount' => 0,
            'subtotal' => 40000,
        ]);

        // revenue 40000, HPP 5000 x 2 = 10000, profit 30000, margin 75%
        $this->getJson('/api/reports/profit-loss')
            ->assertOk()
            ->assertJsonPath('revenue', 40000)
            ->assertJsonPath('hpp', 10000)
            ->assertJsonPath('profit', 30000)
            ->assertJsonPath('transactions', 1)
            ->assertJsonPath('margin', 75); // round() float, ter-encode sebagai int di JSON
    }

    public function test_export_excel_streams_csv_and_pdf_is_stubbed(): void
    {
        $this->actingAsOwner();
        Transaction::factory()->create(['status' => 'completed']);

        $csv = $this->get('/api/reports/export/excel')->assertOk();
        $this->assertStringContainsString('Kasir', $csv->streamedContent());

        $this->getJson('/api/reports/export/pdf')
            ->assertStatus(500)
            ->assertJsonPath('message', 'Export PDF belum dikonfigurasi (DomPDF).');
    }

    public function test_analytics_endpoints_return_data(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create(['price' => 20000]);
        Recipe::factory()->create(['menu_id' => $menu->id, 'total_hpp' => 5000]);
        $transaction = Transaction::factory()->create(['status' => 'completed', 'total_amount' => 40000]);
        $transaction->items()->create([
            'menu_id' => $menu->id,
            'qty' => 1,
            'price' => 20000,
            'discount' => 0,
            'subtotal' => 20000,
        ]);

        $revenue = $this->getJson('/api/reports/analytics/revenue')->assertOk();
        $this->assertIsArray($revenue->json());

        $this->getJson('/api/reports/analytics/profit')
            ->assertOk()
            ->assertJsonPath('profit', 35000);

        $best = $this->getJson('/api/reports/analytics/best-selling')->assertOk();
        $this->assertCount(1, $best->json());
    }
}
