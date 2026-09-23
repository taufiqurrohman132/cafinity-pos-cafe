<?php

namespace Tests\Feature\Api;

use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupplierTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'PT Kopi Nusantara',
            'phone' => '08123456789',
            'email' => 'sales@kopinusantara.test',
            'address' => 'Jl. Merdeka 1',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'category' => 'Bahan Baku',
            'payment_term' => 'Net 30',
            'lead_time' => 3,
            'min_order' => 100,
            'status' => 'active',
            'contact_name' => 'Andi Wijaya',
            'contact_phone' => '0811111111',
            'contact_email' => 'andi@kopinusantara.test',
            'contact_position' => 'Finance Manager',
        ], $overrides);
    }

    public function test_guest_cannot_access_suppliers(): void
    {
        $this->getJson('/api/suppliers')->assertStatus(401);
    }

    public function test_index_returns_suppliers_with_stats(): void
    {
        $this->actingAsOwner();
        Supplier::factory()->count(2)->create(['status' => 'active']);

        $this->getJson('/api/suppliers')
            ->assertOk()
            ->assertJsonStructure([
                'suppliers' => ['data'],
                'filters',
                'categories',
                'stats' => ['total_active', 'new_this_month', 'avg_lead_time', 'avg_rating'],
                'recent_activities',
            ])
            ->assertJsonCount(2, 'suppliers.data');
    }

    public function test_index_can_filter_by_search_status_and_category(): void
    {
        $this->actingAsOwner();
        Supplier::factory()->create(['name' => 'Supplier Kopi Jaya', 'status' => 'active', 'category' => 'Bahan Baku']);
        Supplier::factory()->create(['name' => 'Supplier Gula', 'status' => 'inactive', 'category' => 'Minuman']);

        $this->getJson('/api/suppliers?search=Kopi')
            ->assertOk()
            ->assertJsonCount(1, 'suppliers.data')
            ->assertJsonPath('suppliers.data.0.name', 'Supplier Kopi Jaya');

        $this->getJson('/api/suppliers?status=inactive')
            ->assertOk()
            ->assertJsonCount(1, 'suppliers.data');

        $this->getJson('/api/suppliers?category=Minuman')
            ->assertOk()
            ->assertJsonCount(1, 'suppliers.data');
    }

    public function test_can_create_supplier_with_primary_contact_and_auto_code(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/suppliers', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('supplier.code', 'SUP-1001')
            ->assertJsonPath('supplier.is_active', true);

        $supplier = Supplier::where('name', 'PT Kopi Nusantara')->first();
        $this->assertNotNull($supplier);
        $this->assertDatabaseHas('supplier_contacts', [
            'supplier_id' => $supplier->id,
            'name' => 'Andi Wijaya',
            'is_primary' => true,
        ]);
    }

    public function test_create_supplier_requires_name_category_status_and_contact(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/suppliers', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'category', 'status', 'contact_name']);
    }

    public function test_create_supplier_rejects_invalid_status(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/suppliers', $this->validPayload(['status' => 'unknown']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_can_show_supplier_with_relations(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create();

        $response = $this->getJson("/api/suppliers/{$supplier->id}")->assertOk();
        // Relasi purchaseOrders terserialisasi sebagai snake_case (purchase_orders) di JSON.
        $response->assertJsonStructure(['supplier' => ['id', 'name', 'contacts', 'documents', 'purchase_orders']]);
    }

    public function test_show_returns_404_for_missing_supplier(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/suppliers/999999')->assertStatus(404);
    }

    public function test_edit_returns_supplier_with_primary_contact(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create();

        $this->getJson("/api/suppliers/{$supplier->id}/edit")
            ->assertOk()
            ->assertJsonStructure(['supplier' => ['id', 'name', 'contacts']]);
    }

    public function test_can_update_supplier_and_its_primary_contact(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create(['code' => 'SUP-777']);
        $payload = $this->validPayload([
            'name' => 'Supplier Renamed',
            'contact_name' => 'Budi',
            'code' => 'SUP-777',
        ]);

        $this->putJson("/api/suppliers/{$supplier->id}", $payload)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('supplier.name', 'Supplier Renamed');

        $this->assertDatabaseHas('suppliers', ['id' => $supplier->id, 'name' => 'Supplier Renamed']);
        $this->assertDatabaseHas('supplier_contacts', [
            'supplier_id' => $supplier->id,
            'name' => 'Budi',
            'is_primary' => true,
        ]);
    }

    public function test_supplier_code_must_be_unique(): void
    {
        $this->actingAsOwner();
        $taken = Supplier::factory()->create(['code' => 'SUP-TAKEN']);
        $supplier = Supplier::factory()->create(['code' => 'SUP-OWN']);

        $this->putJson("/api/suppliers/{$supplier->id}", $this->validPayload(['code' => 'SUP-TAKEN']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('code');

        // kode sendiri tetap boleh
        $this->putJson("/api/suppliers/{$supplier->id}", $this->validPayload(['code' => 'SUP-OWN']))
            ->assertOk();

        $this->assertNotNull($taken->fresh());
    }

    public function test_can_delete_supplier(): void
    {
        $this->actingAsOwner();
        $supplier = Supplier::factory()->create();

        $this->deleteJson("/api/suppliers/{$supplier->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('suppliers', ['id' => $supplier->id]);
    }
}
