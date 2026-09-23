<?php

namespace Tests\Feature\Api;

use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\InventoryLog;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_inventories(): void
    {
        $this->getJson('/api/inventories')->assertStatus(401);
    }

    public function test_index_returns_inventories_with_stats(): void
    {
        $this->actingAsOwner();
        Inventory::factory()->create(['stock' => 3, 'min_stock' => 5, 'price_per_unit' => 1000]);
        Inventory::factory()->create(['stock' => 50, 'min_stock' => 5, 'price_per_unit' => 2000]);

        $this->getJson('/api/inventories')
            ->assertOk()
            ->assertJsonStructure([
                'inventories' => ['data'],
                'totalValue',
                'lowStockCount',
                'restockCount',
                'recentLogs',
                'criticalItem',
                'categories',
            ])
            ->assertJsonCount(2, 'inventories.data');
    }

    public function test_index_can_filter_by_status_search_and_category(): void
    {
        $this->actingAsOwner();
        $category = InventoryCategory::factory()->create();
        Inventory::factory()->create(['name' => 'Gula Aren', 'stock' => 2, 'min_stock' => 5]);
        Inventory::factory()->create(['name' => 'Susu Segar', 'stock' => 0, 'min_stock' => 5]);
        Inventory::factory()->create(['name' => 'Kopi Beans', 'stock' => 100, 'min_stock' => 5]);

        $this->getJson('/api/inventories?status=low')
            ->assertOk()
            ->assertJsonCount(1, 'inventories.data')
            ->assertJsonPath('inventories.data.0.name', 'Gula Aren');

        $this->getJson('/api/inventories?status=empty')
            ->assertOk()
            ->assertJsonCount(1, 'inventories.data')
            ->assertJsonPath('inventories.data.0.name', 'Susu Segar');

        $this->getJson('/api/inventories?status=safe')
            ->assertOk()
            ->assertJsonCount(1, 'inventories.data')
            ->assertJsonPath('inventories.data.0.name', 'Kopi Beans');

        $this->getJson('/api/inventories?search=Gula')
            ->assertOk()
            ->assertJsonCount(1, 'inventories.data');

        $this->getJson('/api/inventories?category_id=' . $category->id)
            ->assertOk()
            ->assertJsonCount(0, 'inventories.data');
    }

    public function test_can_create_inventory(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create();
        $category = InventoryCategory::factory()->create();

        $this->postJson('/api/inventories', [
            'name' => 'Kopi Arabika',
            'unit' => 'gram',
            'stock' => 25,
            'min_stock' => 10,
            'price_per_unit' => 150000,
            'supplier_id' => $supplier->id,
            'inventory_category_id' => $category->id,
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('inventories', ['name' => 'Kopi Arabika', 'stock' => 25]);
    }

    public function test_create_inventory_requires_name_and_unit(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/inventories', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'unit']);
    }

    public function test_create_inventory_rejects_unknown_supplier(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/inventories', [
            'name' => 'Item',
            'unit' => 'pcs',
            'supplier_id' => 999999,
        ])->assertStatus(422)->assertJsonValidationErrors('supplier_id');
    }

    public function test_can_show_inventory(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->getJson("/api/inventories/{$inventory->id}")
            ->assertOk()
            ->assertJsonStructure(['inventory' => ['id', 'name', 'supplier', 'category', 'logs']]);
    }

    public function test_create_form_returns_suppliers_and_categories(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/inventories/create')
            ->assertOk()
            ->assertJsonStructure(['suppliers', 'categories']);
    }

    public function test_edit_form_returns_inventory_with_options(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->getJson("/api/inventories/{$inventory->id}/edit")
            ->assertOk()
            ->assertJsonStructure(['inventory', 'suppliers', 'categories']);
    }

    public function test_can_update_inventory(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->putJson("/api/inventories/{$inventory->id}", [
            'name' => 'Gula Halus',
            'unit' => 'gram',
            'stock' => 40,
            'min_stock' => 5,
            'price_per_unit' => 2000,
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('inventories', ['id' => $inventory->id, 'name' => 'Gula Halus', 'stock' => 40]);
    }

    public function test_can_delete_inventory(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->deleteJson("/api/inventories/{$inventory->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('inventories', ['id' => $inventory->id]);
    }

    public function test_low_stock_list_returns_items_at_or_below_min_stock(): void
    {
        $this->actingAsOwner();
        Inventory::factory()->create(['stock' => 2, 'min_stock' => 5]);
        Inventory::factory()->create(['stock' => 50, 'min_stock' => 5]);

        $this->getJson('/api/inventories/low-stock/list')
            ->assertOk()
            ->assertJsonCount(1, 'inventories');
    }

    public function test_restock_increases_stock_and_writes_inventory_log(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create(['stock' => 10, 'min_stock' => 5]);

        $this->postJson("/api/inventories/{$inventory->id}/restock", ['qty' => 15])
            ->assertOk()
            ->assertJsonPath('inventory.stock', 25); // float bulat ter-encode sebagai int di JSON

        $this->assertDatabaseHas('inventories', ['id' => $inventory->id, 'stock' => 25]);
        $this->assertDatabaseHas('inventory_logs', [
            'inventory_id' => $inventory->id,
            'type' => 'restock',
            'qty' => 15,
            'stock_before' => 10,
            'stock_after' => 25,
        ]);
    }

    public function test_restock_requires_positive_qty(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->postJson("/api/inventories/{$inventory->id}/restock", ['qty' => 0])
            ->assertStatus(422)
            ->assertJsonValidationErrors('qty');
    }

    public function test_adjust_out_decreases_stock_and_logs_it(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create(['stock' => 20, 'min_stock' => 5]);

        $this->postJson("/api/inventories/{$inventory->id}/adjust", [
            'qty' => 5,
            'type' => 'waste',
            'direction' => 'out',
            'notes' => 'Tumpah',
        ])->assertOk();

        $this->assertDatabaseHas('inventories', ['id' => $inventory->id, 'stock' => 15]);
        $this->assertDatabaseHas('inventory_logs', [
            'inventory_id' => $inventory->id,
            'type' => 'waste',
            'qty' => 5,
            'stock_before' => 20,
            'stock_after' => 15,
            'notes' => 'Tumpah',
        ]);
    }

    public function test_adjust_increases_stock_when_direction_is_in(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create(['stock' => 20]);

        $this->postJson("/api/inventories/{$inventory->id}/adjust", [
            'qty' => 7,
            'type' => 'restock',
            'direction' => 'in',
        ])->assertOk()->assertJsonPath('inventory.stock', 27);
    }

    public function test_adjust_rejects_invalid_type_or_direction(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create();

        $this->postJson("/api/inventories/{$inventory->id}/adjust", [
            'qty' => 1,
            'type' => 'invalid-type',
            'direction' => 'in',
        ])->assertStatus(422)->assertJsonValidationErrors('type');

        $this->postJson("/api/inventories/{$inventory->id}/adjust", [
            'qty' => 1,
            'type' => 'adjustment',
            'direction' => 'sideways',
        ])->assertStatus(422)->assertJsonValidationErrors('direction');
    }

    public function test_can_create_inventory_category(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/inventory-categories', ['name' => 'Bahan Segar'])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('inventory_categories', ['name' => 'Bahan Segar']);
    }

    public function test_inventory_category_name_must_be_unique(): void
    {
        $this->actingAsOwner();
        InventoryCategory::factory()->create(['name' => 'Bahan Kering']);

        $this->postJson('/api/inventory-categories', ['name' => 'Bahan Kering'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }
}
