<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_categories(): void
    {
        $this->getJson('/api/categories')->assertStatus(401);
    }

    public function test_index_returns_paginated_categories(): void
    {
        $this->actingAsOwner();

        Category::factory()->count(2)->create();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonStructure(['categories' => ['data']])
            ->assertJsonCount(2, 'categories.data');
    }

    public function test_can_create_category_with_slug(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/categories', [
            'name' => 'Minuman Dingin',
            'description' => 'Es dan minuman dingin',
            'is_active' => true,
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('category.slug', 'minuman-dingin');

        $this->assertDatabaseHas('categories', ['name' => 'Minuman Dingin', 'slug' => 'minuman-dingin']);
    }

    public function test_create_category_requires_name(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/categories', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_can_show_category_with_menus(): void
    {
        $this->actingAsOwner();
        $category = Category::factory()->create();

        $this->getJson("/api/categories/{$category->id}")
            ->assertOk()
            ->assertJsonStructure(['category' => ['id', 'name', 'menus']]);
    }

    public function test_show_returns_404_for_missing_category(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/categories/999999')->assertStatus(404);
    }

    public function test_can_update_category(): void
    {
        $this->actingAsOwner();
        $category = Category::factory()->create(['name' => 'Lama']);

        $this->putJson("/api/categories/{$category->id}", [
            'name' => 'Baru Sekali',
            'is_active' => false,
        ])->assertOk()->assertJsonPath('category.name', 'Baru Sekali');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Baru Sekali',
            'slug' => 'baru-sekali',
            'is_active' => false,
        ]);
    }

    public function test_can_delete_category(): void
    {
        $this->actingAsOwner();
        $category = Category::factory()->create();

        $this->deleteJson("/api/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }
}
