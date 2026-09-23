<?php

namespace Tests\Feature\Api;

use App\Models\Bundle;
use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BundleTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_bundles(): void
    {
        $this->getJson('/api/bundles')->assertStatus(401);
    }

    public function test_index_returns_paginated_bundles(): void
    {
        $this->actingAsOwner();
        Bundle::factory()->count(2)->create();

        $this->getJson('/api/bundles')
            ->assertOk()
            ->assertJsonStructure(['bundles' => ['data', 'total']])
            ->assertJsonCount(2, 'bundles.data');
    }

    public function test_can_create_bundle_with_menus(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create();

        $this->postJson('/api/bundles', [
            'name' => 'Paket Sarapan',
            'description' => 'Croissant + Kopi',
            'price' => 45000,
            'is_active' => true,
            'menus' => [
                ['id' => $menu->id, 'qty' => 2],
            ],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('bundle.name', 'Paket Sarapan');

        $bundle = Bundle::where('name', 'Paket Sarapan')->first();
        $this->assertNotNull($bundle);
        $this->assertSame(1, $bundle->menus()->count());
        $this->assertDatabaseHas('bundle_items', [
            'bundle_id' => $bundle->id,
            'menu_id' => $menu->id,
            'qty' => 2,
        ]);
    }

    public function test_create_bundle_validates_required_fields(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/bundles', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price']);

        $this->postJson('/api/bundles', [
            'name' => 'X',
            'price' => 1000,
            'menus' => [['id' => 999999, 'qty' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors('menus.0.id');
    }

    public function test_can_show_bundle_with_menus(): void
    {
        $this->actingAsOwner();
        $bundle = Bundle::factory()->create();
        $bundle->menus()->attach(Menu::factory()->create()->id, ['qty' => 1]);

        $this->getJson("/api/bundles/{$bundle->id}")
            ->assertOk()
            ->assertJsonStructure(['bundle' => ['id', 'name', 'menus']]);
    }

    public function test_show_returns_404_for_missing_bundle(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/bundles/999999')->assertStatus(404);
    }

    public function test_can_update_bundle_and_sync_menus(): void
    {
        $this->actingAsOwner();
        $bundle = Bundle::factory()->create();
        $menuA = Menu::factory()->create();
        $menuB = Menu::factory()->create();
        $bundle->menus()->attach($menuA->id, ['qty' => 3]);

        $this->putJson("/api/bundles/{$bundle->id}", [
            'name' => 'Bundle Revisi',
            'price' => 60000,
            'is_active' => false,
            'menus' => [
                ['id' => $menuB->id, 'qty' => 1],
            ],
        ])->assertOk()->assertJsonPath('success', true);

        $bundle->refresh();
        $this->assertSame('Bundle Revisi', $bundle->name);
        $this->assertSame(60000, $bundle->price);
        $this->assertFalse((bool) $bundle->is_active);
        // sync menggantikan daftar menu lama
        $this->assertSame([$menuB->id], $bundle->menus()->pluck('menus.id')->all());
    }

    public function test_can_delete_bundle(): void
    {
        $this->actingAsOwner();
        $bundle = Bundle::factory()->create();

        $this->deleteJson("/api/bundles/{$bundle->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('bundles', ['id' => $bundle->id]);
    }
}
