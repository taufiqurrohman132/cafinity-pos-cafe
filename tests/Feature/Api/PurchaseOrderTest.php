<?php

namespace Tests\Feature\Api;

use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseOrderTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'supplier_id' => Supplier::factory()->create()->id,
            'delivery_location' => 'Gudang Utama',
            'delivery_date' => now()->addDays(7)->toDateString(),
            'notes' => 'Pengiriman mingguan',
            'items' => [
                [
                    'inventory_id' => Inventory::factory()->create(['name' => 'Kopi'])->id,
                    'qty' => 10,
                    'unit' => 'kg',
                    'price_per_unit' => 120000,
                ],
            ],
        ], $overrides);
    }

    public function test_guest_cannot_access_purchase_orders(): void
    {
        $this->getJson('/api/purchase-orders')->assertStatus(401);
    }

    public function test_index_returns_orders_with_stats_and_filters(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create();
        PurchaseOrder::factory()->create(['supplier_id' => $supplier->id, 'status' => 'pending']);

        $this->getJson('/api/purchase-orders')
            ->assertOk()
            ->assertJsonStructure([
                'orders' => ['data'],
                'filters',
                'stats' => ['total_orders', 'pending_approvals', 'waiting_delivery'],
                'recentApprovals',
            ])
            ->assertJsonCount(1, 'orders.data');

        $this->getJson('/api/purchase-orders?status=pending')
            ->assertOk()
            ->assertJsonCount(1, 'orders.data');

        $this->getJson('/api/purchase-orders?search=' . $supplier->name)
            ->assertOk()
            ->assertJsonCount(1, 'orders.data');
    }

    public function test_create_form_returns_suppliers_and_inventories(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/purchase-orders/create')
            ->assertOk()
            ->assertJsonStructure(['suppliers', 'inventories']);
    }

    public function test_can_create_purchase_order_with_items(): void
    {
        $this->actingAsOwner();
        $payload = $this->validPayload();

        $this->postJson('/api/purchase-orders', $payload)
            ->assertOk()
            ->assertJsonPath('success', true);

        $order = PurchaseOrder::first();
        $this->assertNotNull($order);
        $this->assertSame('pending', $order->status);
        $this->assertSame('PO-' . now()->year . '-0001', $order->po_number);
        $this->assertSame(10 * 120000, $order->total_amount);

        $this->assertDatabaseHas('purchase_order_items', [
            'purchase_order_id' => $order->id,
            'inventory_id' => $payload['items'][0]['inventory_id'],
            'qty' => 10,
        ]);
    }

    public function test_create_purchase_order_requires_supplier_and_items(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/purchase-orders', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['supplier_id', 'items']);

        $this->postJson('/api/purchase-orders', $this->validPayload([
            'items' => [['inventory_id' => 1, 'qty' => 0, 'unit' => 'kg', 'price_per_unit' => 1000]],
        ]))->assertStatus(422)->assertJsonValidationErrors('items.0.qty');
    }

    public function test_can_show_purchase_order_with_audit_logs(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create();

        $this->getJson("/api/purchase-orders/{$order->id}")
            ->assertOk()
            ->assertJsonStructure(['order' => ['id', 'po_number', 'items'], 'auditLogs', 'currentUser']);
    }

    public function test_show_returns_404_for_missing_order(): void
    {
        $this->actingAsOwner();
        $this->getJson('/api/purchase-orders/999999')->assertStatus(404);
    }

    public function test_edit_only_allowed_for_pending_orders(): void
    {
        $this->actingAsOwner();
        $pending = PurchaseOrder::factory()->create(['status' => 'pending']);
        $approved = PurchaseOrder::factory()->create(['status' => 'approved']);

        $this->getJson("/api/purchase-orders/{$pending->id}/edit")
            ->assertOk()
            ->assertJsonStructure(['order', 'suppliers', 'inventories']);

        $this->getJson("/api/purchase-orders/{$approved->id}/edit")
            ->assertStatus(400)
            ->assertJsonPath('message', 'PO tidak dapat diedit.');
    }

    public function test_can_update_pending_purchase_order(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'pending']);

        $newInventory = Inventory::factory()->create();
        $this->putJson("/api/purchase-orders/{$order->id}", [
            'supplier_id' => $order->supplier_id,
            'notes' => 'Diperbarui',
            'items' => [
                ['inventory_id' => $newInventory->id, 'qty' => 5, 'unit' => 'liter', 'price_per_unit' => 20000],
            ],
        ])->assertOk()->assertJsonPath('success', true);

        $order->refresh();
        $this->assertSame('Diperbarui', $order->notes);
        $this->assertSame(5 * 20000, $order->total_amount);
        $this->assertSame(1, $order->items()->count());
        $this->assertDatabaseHas('purchase_order_items', [
            'purchase_order_id' => $order->id,
            'inventory_id' => $newInventory->id,
        ]);
    }

    public function test_update_rejected_when_order_not_pending(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'approved']);

        $this->putJson("/api/purchase-orders/{$order->id}", [])
            ->assertStatus(400)
            ->assertJsonPath('message', 'PO tidak dapat diperbarui.');
    }

    public function test_can_delete_pending_purchase_order(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'pending']);

        $this->deleteJson("/api/purchase-orders/{$order->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('purchase_orders', ['id' => $order->id]);
    }

    public function test_delete_rejected_when_order_not_pending(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'approved']);

        $this->deleteJson("/api/purchase-orders/{$order->id}")
            ->assertStatus(400)
            ->assertJsonPath('message', 'PO tidak dapat dihapus.');
    }

    public function test_can_approve_pending_purchase_order(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'pending']);

        $this->postJson("/api/purchase-orders/{$order->id}/approve")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('purchase_orders', ['id' => $order->id, 'status' => 'approved']);
    }

    public function test_can_reject_purchase_order(): void
    {
        $this->actingAsOwner();
        $order = PurchaseOrder::factory()->create(['status' => 'pending']);

        $this->postJson("/api/purchase-orders/{$order->id}/reject", ['reason' => 'Stok cukup'])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('purchase_orders', ['id' => $order->id, 'status' => 'rejected']);
    }

    public function test_receive_requires_approved_status_and_updates_stock(): void
    {
        $this->actingAsOwner();
        $inventory = Inventory::factory()->create(['stock' => 4, 'min_stock' => 2]);
        $pending = PurchaseOrder::factory()->create(['status' => 'pending']);
        $approved = PurchaseOrder::factory()->create([
            'status' => 'approved',
            'total_amount' => 500000,
        ]);
        $approved->items()->create([
            'inventory_id' => $inventory->id,
            'qty' => 6,
            'unit' => 'kg',
            'price_per_unit' => 10000,
            'subtotal' => 60000,
        ]);

        $this->postJson("/api/purchase-orders/{$pending->id}/receive")
            ->assertStatus(400)
            ->assertJsonPath('message', 'PO harus disetujui terlebih dahulu.');

        $this->postJson("/api/purchase-orders/{$approved->id}/receive")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('purchase_orders', ['id' => $approved->id, 'status' => 'received']);
        $this->assertDatabaseHas('inventories', ['id' => $inventory->id, 'stock' => 10]);
        $this->assertDatabaseHas('inventory_logs', [
            'inventory_id' => $inventory->id,
            'type' => 'in',
            'stock_before' => 4,
            'stock_after' => 10,
        ]);
    }
}
