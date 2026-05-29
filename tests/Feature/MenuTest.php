<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed users (roles/permissions) and categories
        $this->seed(UserSeeder::class);
        $this->seed(CategorySeeder::class);
    }

    public function test_unauthenticated_user_cannot_access_menus_index()
    {
        $response = $this->get(route('menus.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_with_manage_menu_permission_can_access_menus_index()
    {
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();

        $response = $this->actingAs($owner)->get(route('menus.index'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_create_menu_item()
    {
        Storage::fake('public');
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();
        $category = Category::first();

        $image = UploadedFile::fake()->image('caffe-latte.jpg');

        $response = $this->actingAs($owner)->post(route('menus.store'), [
            'category_id' => $category->id,
            'name' => 'Caffe Latte Baru',
            'description' => 'A wonderful cup of coffee',
            'price' => 28000,
            'is_active' => true,
            'image' => $image,
            'estimated_hpp' => 8500,
        ]);

        $response->assertRedirect(route('menus.index'));
        
        $this->assertDatabaseHas('menus', [
            'name' => 'Caffe Latte Baru',
            'price' => 28000,
        ]);

        $menu = Menu::where('name', 'Caffe Latte Baru')->first();
        $this->assertNotNull($menu->image);
        Storage::disk('public')->assertExists($menu->image);

        // Verify that recipe with estimated HPP was created
        $this->assertDatabaseHas('recipes', [
            'menu_id' => $menu->id,
            'total_hpp' => 8500,
        ]);
    }

    public function test_cashier_cannot_create_menu_item()
    {
        $cashier = User::where('email', 'rizky.p@smartcafe.id')->first();
        $category = Category::first();

        $response = $this->actingAs($cashier)->post(route('menus.store'), [
            'category_id' => $category->id,
            'name' => 'Caffe Latte Unauthorized',
            'description' => 'Should fail',
            'price' => 28000,
            'is_active' => true,
        ]);

        $response->assertStatus(403);
    }

    public function test_authenticated_user_can_update_menu_item()
    {
        Storage::fake('public');
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();
        $category = Category::first();
        
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Old Menu Name',
            'slug' => 'old-menu-name',
            'description' => 'Old description',
            'price' => 15000,
            'is_active' => true,
            'image' => 'menus/old-image.jpg',
        ]);

        // Create initial recipe
        $menu->recipe()->create([
            'total_hpp' => 5000,
            'notes' => 'Old HPP',
        ]);

        $newImage = UploadedFile::fake()->image('caffe-latte-new.jpg');

        $response = $this->actingAs($owner)->put(route('menus.update', $menu->id), [
            'category_id' => $category->id,
            'name' => 'Updated Menu Name',
            'description' => 'Updated description',
            'price' => 18000,
            'is_active' => false,
            'image' => $newImage,
            'estimated_hpp' => 6500,
        ]);

        $response->assertRedirect(route('menus.index'));

        $this->assertDatabaseHas('menus', [
            'id' => $menu->id,
            'name' => 'Updated Menu Name',
            'price' => 18000,
            'is_active' => false,
        ]);

        $menu->refresh();
        $this->assertNotNull($menu->image);
        $this->assertNotEquals('menus/old-image.jpg', $menu->image);
        Storage::disk('public')->assertExists($menu->image);

        // Verify recipe HPP was updated
        $this->assertDatabaseHas('recipes', [
            'menu_id' => $menu->id,
            'total_hpp' => 6500,
        ]);
    }

    public function test_authenticated_user_can_update_menu_item_without_changing_image_preserves_existing_image()
    {
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();
        $category = Category::first();
        
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Original Menu Name',
            'slug' => 'original-menu-name',
            'description' => 'Original description',
            'price' => 15000,
            'is_active' => true,
            'image' => 'menus/some-existing-image.jpg',
        ]);

        $response = $this->actingAs($owner)->put(route('menus.update', $menu->id), [
            'category_id' => $category->id,
            'name' => 'Updated Menu Name',
            'description' => 'Updated description',
            'price' => 18000,
            'is_active' => true,
            'image' => null, // No new file uploaded (payload is null)
            'estimated_hpp' => 6500,
        ]);

        $response->assertRedirect(route('menus.index'));

        $this->assertDatabaseHas('menus', [
            'id' => $menu->id,
            'name' => 'Updated Menu Name',
            'image' => 'menus/some-existing-image.jpg', // Preserved!
        ]);
    }

    public function test_authenticated_user_can_delete_menu_item()
    {
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();
        $category = Category::first();
        
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'To Be Deleted',
            'slug' => 'to-be-deleted',
            'description' => 'To be deleted description',
            'price' => 15000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($owner)->delete(route('menus.destroy', $menu->id));

        $response->assertRedirect(route('menus.index'));
        $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
    }

    public function test_authenticated_user_can_toggle_menu_status()
    {
        $owner = User::where('email', 'budi.s@smartcafe.id')->first();
        $category = Category::first();
        
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Toggle Status Menu',
            'slug' => 'toggle-status-menu',
            'price' => 15000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($owner)->post(route('menus.toggle-status', $menu->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('menus', [
            'id' => $menu->id,
            'is_active' => false,
        ]);
    }
}
