<?php

namespace Tests\Unit\Models;

use App\Models\Inventory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit test perilaku model Inventory: threshold stok & adjustStock.
 */
class InventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_is_low_stock_at_or_below_min_stock(): void
    {
        $atThreshold = new Inventory(['stock' => 5, 'min_stock' => 5]);
        $below = new Inventory(['stock' => 2, 'min_stock' => 5]);
        $above = new Inventory(['stock' => 10, 'min_stock' => 5]);

        $this->assertTrue($atThreshold->isLowStock());
        $this->assertTrue($below->isLowStock());
        $this->assertFalse($above->isLowStock());
    }

    public function test_adjust_stock_increases_stock_and_writes_log(): void
    {
        $inventory = Inventory::factory()->create(['stock' => 20.0, 'min_stock' => 5]);

        $inventory->adjustStock(7.5, 'restock', 'Pembelian supplier');

        $this->assertSame(27.5, $inventory->fresh()->stock);

        $log = $inventory->logs()->latest('id')->first();
        $this->assertNotNull($log);
        $this->assertSame('restock', $log->type);
        $this->assertSame(20.0, (float) $log->stock_before);
        $this->assertSame(27.5, (float) $log->stock_after);
        $this->assertSame(7.5, (float) $log->qty); // selalu nilai absolut
        $this->assertSame('Pembelian supplier', $log->notes);
    }

    public function test_adjust_stock_decreases_stock_with_positive_qty_in_log(): void
    {
        $inventory = Inventory::factory()->create(['stock' => 10.0, 'min_stock' => 5]);

        // Arah "keluar" dikirim sebagai qty negatif; log menyimpan |qty|.
        // (Kolom type enum: in, out, adjustment, restock, waste.)
        $inventory->adjustStock(-4.0, 'out', 'Pemakaian produksi');

        $this->assertSame(6.0, $inventory->fresh()->stock);

        $log = $inventory->logs()->latest('id')->first();
        $this->assertSame(4.0, (float) $log->qty);
        $this->assertSame(10.0, (float) $log->stock_before);
        $this->assertSame(6.0, (float) $log->stock_after);
    }

    public function test_stock_and_min_stock_are_cast_to_float(): void
    {
        $inventory = Inventory::factory()->create(['stock' => 3, 'min_stock' => 7]);

        $this->assertIsFloat($inventory->stock);
        $this->assertIsFloat($inventory->min_stock);
    }
}
