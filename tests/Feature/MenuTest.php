<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Menu via API: /api/menus (apiResource) + toggle-status + upload-image.
 */
class MenuTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(CategorySeeder::class);
        $this->owner = $this->makeUser('owner');
    }

    public function test_guest_cannot_access_menus(): void
    {
        $this->getJson('/api/menus')->assertStatus(401);
    }

    public function test_index_returns_menus_categories_and_total(): void
    {
        Menu::factory()->count(2)->create();

        $response = $this->apiAs($this->owner)->getJson('/api/menus');

        $response->assertOk()->assertJsonStructure([
            'menus' => ['data'],
            'categories',
            'totalMenus',
            'editMenu',
        ]);

        $this->assertSame(2, $response->json('totalMenus'));
    }

    public function test_index_can_filter_by_search_category_and_status(): void
    {
        $category = Category::first();
        Menu::factory()->create(['name' => 'Kopi Susu', 'category_id' => $category->id]);
        Menu::factory()->create(['name' => 'Teh Manis', 'is_active' => false]);

        $this->apiAs($this->owner)->getJson('/api/menus?search=Kopi')
            ->assertOk()
            ->assertJsonCount(1, 'menus.data')
            ->assertJsonPath('menus.data.0.name', 'Kopi Susu');

        $this->apiAs($this->owner)->getJson('/api/menus?category=' . $category->id)
            ->assertOk()
            ->assertJsonCount(1, 'menus.data');

        $this->apiAs($this->owner)->getJson('/api/menus?status=inactive')
            ->assertOk()
            ->assertJsonCount(1, 'menus.data')
            ->assertJsonPath('menus.data.0.name', 'Teh Manis');
    }

    public function test_can_create_menu_with_image_and_estimated_hpp(): void
    {
        Storage::fake('public');
        $category = Category::first();

        $response = $this->apiAs($this->owner)->post('/api/menus', [
            'category_id' => $category->id,
            'name' => 'Caffe Latte Baru',
            'description' => 'A wonderful cup of coffee',
            'price' => 28000,
            'is_active' => true,
            'image' => UploadedFile::fake()->image('caffe-latte.jpg'),
            'estimated_hpp' => 8500,
        ]);

        $response->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('menus', ['name' => 'Caffe Latte Baru', 'price' => 28000]);

        $menu = Menu::where('name', 'Caffe Latte Baru')->first();
        $this->assertNotNull($menu->image);
        Storage::disk('public')->assertExists($menu->image);

        // Resep dengan HPP estimasi ikut dibuat
        $this->assertDatabaseHas('recipes', ['menu_id' => $menu->id, 'total_hpp' => 8500]);
    }

    public function test_create_menu_requires_valid_payload(): void
    {
        $this->apiAs($this->owner)->postJson('/api/menus', [
            'name' => 'Tanpa Harga',
        ])->assertStatus(422)->assertJsonValidationErrors(['category_id', 'price']);

        $this->apiAs($this->owner)->postJson('/api/menus', [
            'category_id' => 999999,
            'name' => 'Kategori Salah',
            'price' => 1000,
        ])->assertStatus(422)->assertJsonValidationErrors('category_id');
    }

    public function test_can_show_menu_detail(): void
    {
        $menu = Menu::factory()->create();

        $this->apiAs($this->owner)->getJson("/api/menus/{$menu->id}")
            ->assertOk()
            ->assertJsonStructure([
                'menu' => ['id', 'name', 'hpp', 'profit_trend', 'is_best_seller'],
                'categories',
                'weeklySales',
                'weeklyGrowth',
            ]);
    }

    public function test_show_returns_404_for_missing_menu(): void
    {
        $this->apiAs($this->owner)->getJson('/api/menus/999999')->assertStatus(404);
    }

    public function test_can_update_menu_and_replace_image(): void
    {
        Storage::fake('public');
        $category = Category::first();
        $menu = Menu::factory()->create([
            'category_id' => $category->id,
            'image' => 'menus/old-image.jpg',
        ]);
        $menu->recipe()->create(['total_hpp' => 5000, 'notes' => 'Old HPP']);

        $response = $this->apiAs($this->owner)->put("/api/menus/{$menu->id}", [
            'category_id' => $category->id,
            'name' => 'Updated Menu Name',
            'description' => 'Updated description',
            'price' => 18000,
            'is_active' => false,
            'image' => UploadedFile::fake()->image('new.jpg'),
            'estimated_hpp' => 6500,
        ]);

        $response->assertOk()->assertJsonPath('success', true);

        $menu->refresh();
        $this->assertSame('Updated Menu Name', $menu->name);
        $this->assertSame(18000, $menu->price);
        $this->assertFalse($menu->is_active);
        $this->assertNotEquals('menus/old-image.jpg', $menu->image);
        Storage::disk('public')->assertExists($menu->image);

        $this->assertDatabaseHas('recipes', ['menu_id' => $menu->id, 'total_hpp' => 6500]);
    }

    public function test_update_preserves_existing_image_when_not_uploaded(): void
    {
        $menu = Menu::factory()->create(['image' => 'menus/some-existing-image.jpg']);

        $this->apiAs($this->owner)->putJson("/api/menus/{$menu->id}", [
            'category_id' => $menu->category_id,
            'name' => 'Updated Menu Name',
            'price' => 18000,
            'is_active' => true,
            'image' => null,
            'estimated_hpp' => 6500,
        ])->assertOk();

        $this->assertSame('menus/some-existing-image.jpg', $menu->fresh()->image);
    }

    public function test_can_delete_menu(): void
    {
        $menu = Menu::factory()->create();

        $this->apiAs($this->owner)->deleteJson("/api/menus/{$menu->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
    }

    public function test_can_toggle_menu_status(): void
    {
        $menu = Menu::factory()->create(['is_active' => true]);

        $this->apiAs($this->owner)->postJson("/api/menus/{$menu->id}/toggle-status")
            ->assertOk()
            ->assertJsonPath('menu.is_active', false);

        $this->assertFalse($menu->fresh()->is_active);
    }

    public function test_can_upload_menu_image(): void
    {
        Storage::fake('public');
        $menu = Menu::factory()->create();

        $this->apiAs($this->owner)->post("/api/menus/{$menu->id}/upload-image", [
            'image' => UploadedFile::fake()->image('menu.png'),
        ])->assertOk()->assertJsonPath('success', true);

        $menu->refresh();
        $this->assertNotNull($menu->image);
        Storage::disk('public')->assertExists($menu->image);
    }

    public function test_upload_image_requires_a_real_image(): void
    {
        $menu = Menu::factory()->create();

        $this->apiAs($this->owner)->postJson("/api/menus/{$menu->id}/upload-image", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('image');
    }
}
