<?php

namespace Tests\Unit\Services;

use App\Services\DashboardService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit test DashboardService: routing berdasarkan role, struktur output,
 * dan helper perhitungan murni (trend, format rupiah, sales chart).
 */
class DashboardServiceTest extends TestCase
{
    use RefreshDatabase;

    private DashboardService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new DashboardService();
    }

    /** Panggil method private murni lewat refleksi. */
    private function invokePrivate(string $method, mixed ...$args): mixed
    {
        return (new \ReflectionMethod(DashboardService::class, $method))
            ->invoke($this->service, ...$args);
    }

    // --- Routing role ---

    public function test_owner_gets_owner_payload(): void
    {
        $owner = $this->makeUser('owner');

        $data = $this->service->getDataForUser($owner);

        $this->assertArrayHasKey('stats', $data);
        $this->assertArrayHasKey('salesChart', $data);
        $this->assertArrayHasKey('bestSellingMenus', $data);
        $this->assertArrayHasKey('busyHours', $data);
        $this->assertArrayHasKey('dailyGoal', $data);
        $this->assertArrayHasKey('kitchenQueue', $data);
        // Payload owner memuat 4 kartu statistik utama.
        $this->assertSame(
            ['revenue', 'profit', 'orders', 'avg_ticket'],
            array_keys($data['stats'])
        );
    }

    public function test_admin_gets_admin_payload(): void
    {
        $admin = $this->makeUser('admin');

        $data = $this->service->getDataForUser($admin);

        $this->assertArrayHasKey('hppAnalysis', $data);
        $this->assertArrayHasKey('activityLog', $data);
        $this->assertArrayHasKey('stockMovement', $data);
        $this->assertArrayHasKey('menuSummary', $data);
        $this->assertArrayHasKey('pending_po', $data['stats']);
    }

    public function test_cashier_gets_cashier_payload_as_default(): void
    {
        // role selain owner/admin → fallback cabang default (cashier).
        $cashier = $this->makeUser('cashier');

        $data = $this->service->getDataForUser($cashier);

        $this->assertArrayHasKey('recentTransactions', $data);
        $this->assertArrayHasKey('lowStockItems', $data);
        $this->assertArrayHasKey('shiftInfo', $data);
        $this->assertArrayHasKey('total_cash', $data['stats']);
    }

    // --- Sales chart ---

    public function test_sales_chart_period_shapes(): void
    {
        $this->assertCount(24, $this->service->getSalesChartData('today')['labels']);
        $this->assertCount(7, $this->service->getSalesChartData('7days')['labels']);
        $this->assertCount(30, $this->service->getSalesChartData('30days')['labels']);

        $daysInMonth = (int) now()->daysInMonth;
        $this->assertCount($daysInMonth, $this->service->getSalesChartData('month')['labels']);
    }

    public function test_sales_chart_values_are_normalized_to_max_100_percent(): void
    {
        $chart = $this->service->getSalesChartData('today');

        // DB kosong → semua amount 0, height 0, max fallback >= 1.
        $this->assertGreaterThanOrEqual(1, $chart['max']);
        $this->assertCount(24, $chart['values']);
        foreach ($chart['values'] as $value) {
            $this->assertSame(0, $value['amount']);
            $this->assertSame(0, $value['height']);
        }
    }

    // --- Helper murni ---

    public function test_trend_label_handles_zero_previous(): void
    {
        $this->assertSame('+ 100%', $this->invokePrivate('trendLabel', 10, 0));
        $this->assertSame('0%', $this->invokePrivate('trendLabel', 0, 0));
    }

    public function test_trend_label_formats_percentage_change(): void
    {
        $this->assertSame('+ 50.0%', $this->invokePrivate('trendLabel', 150, 100));
        $this->assertSame('- 50.0%', $this->invokePrivate('trendLabel', 50, 100));
        $this->assertSame('- 100.0%', $this->invokePrivate('trendLabel', 0, 100));
    }

    public function test_trend_type_up_when_current_not_below_previous(): void
    {
        $this->assertSame('up', $this->invokePrivate('trendType', 10, 5));
        $this->assertSame('up', $this->invokePrivate('trendType', 10, 10)); // datar → up
        $this->assertSame('down', $this->invokePrivate('trendType', 5, 10));
    }

    public function test_rupiah_formats_thousands_separator(): void
    {
        $this->assertSame('Rp 1.500.000', $this->invokePrivate('rupiah', 1500000));
        $this->assertSame('Rp 0', $this->invokePrivate('rupiah', 0));
        $this->assertSame('Rp 999', $this->invokePrivate('rupiah', 999));
    }

    public function test_menu_emoji_mapping_by_keyword(): void
    {
        $this->assertSame('☕', $this->invokePrivate('menuEmoji', 'Kopi Susu'));
        $this->assertSame('☕', $this->invokePrivate('menuEmoji', 'Iced Latte'));
        // Catatan: 'Matcha Latte' dipetakan ☕ — cabang 'latte' dicek lebih dulu
        // sebelum 'matcha' (urutan match pada menuEmoji).
        $this->assertSame('🍵', $this->invokePrivate('menuEmoji', 'Matcha'));
        $this->assertSame('🥐', $this->invokePrivate('menuEmoji', 'Butter Croissant'));
        $this->assertSame('🍚', $this->invokePrivate('menuEmoji', 'Nasi Goreng'));
        $this->assertSame('🍽️', $this->invokePrivate('menuEmoji', 'Es Jeruk'));
    }
}
