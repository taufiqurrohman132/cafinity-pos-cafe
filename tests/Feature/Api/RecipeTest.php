<?php

namespace Tests\Feature\Api;

use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecipeTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_recipe_costing(): void
    {
        $this->getJson('/api/recipe-costing')->assertStatus(401);
    }

    public function test_index_returns_recipes_inventories_and_free_menus(): void
    {
        $this->actingAsOwner();
        $withRecipe = Menu::factory()->create(['name' => 'Menu Berresep']);
        Recipe::factory()->create(['menu_id' => $withRecipe->id]);
        Menu::factory()->create(['name' => 'Menu Kosong']);
        Inventory::factory()->create();

        $this->getJson('/api/recipe-costing')
            ->assertOk()
            ->assertJsonStructure([
                'recipes',
                'selectedRecipe',
                'inventories',
                'menus',
            ])
            ->assertJsonCount(1, 'recipes')
            // hanya menu tanpa resep yang ditawarkan
            ->assertJsonCount(1, 'menus')
            ->assertJsonPath('menus.0.name', 'Menu Kosong');
    }

    public function test_can_create_recipe_and_calculates_hpp(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create(['price' => 50000]);
        $kopi = Inventory::factory()->create(['price_per_unit' => 2000]);
        $susu = Inventory::factory()->create(['price_per_unit' => 500]);

        // 2 gram kopi @2000 + 10 ml susu @500 = 4000 + 5000 = 9000
        $this->postJson('/api/recipe-costing', [
            'menu_id' => $menu->id,
            'notes' => 'Resep standar',
            'ingredients' => [
                ['inventory_id' => $kopi->id, 'qty' => 2, 'unit' => 'gram'],
                ['inventory_id' => $susu->id, 'qty' => 10, 'unit' => 'ml'],
            ],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('recipe.total_hpp', 9000);

        $recipe = Recipe::where('menu_id', $menu->id)->first();
        $this->assertNotNull($recipe);
        $this->assertSame(9000, $recipe->total_hpp);
        $this->assertSame(2, $recipe->ingredients()->count());
    }

    public function test_create_recipe_validates_fields(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/recipe-costing', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['menu_id', 'ingredients']);

        $menu = Menu::factory()->create();
        $this->postJson('/api/recipe-costing', [
            'menu_id' => $menu->id,
            'ingredients' => [
                ['inventory_id' => 999999, 'qty' => 1, 'unit' => 'gram'],
            ],
        ])->assertStatus(422)->assertJsonValidationErrors('ingredients.0.inventory_id');
    }

    public function test_recipe_menu_must_be_unique(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create();
        Recipe::factory()->create(['menu_id' => $menu->id]);
        $inventory = Inventory::factory()->create();

        $this->postJson('/api/recipe-costing', [
            'menu_id' => $menu->id,
            'ingredients' => [
                ['inventory_id' => $inventory->id, 'qty' => 1, 'unit' => 'gram'],
            ],
        ])->assertStatus(422)->assertJsonValidationErrors('menu_id');
    }

    public function test_can_update_recipe_and_recalculate_hpp(): void
    {
        $this->actingAsOwner();
        $menu = Menu::factory()->create(['price' => 40000]);
        $inventory = Inventory::factory()->create(['price_per_unit' => 1000]);
        $recipe = Recipe::factory()->create(['menu_id' => $menu->id, 'total_hpp' => 1500]);
        $recipe->ingredients()->attach($inventory->id, ['qty' => 1, 'unit' => 'gram']);

        // qty 5 @1000 = 5000
        $this->putJson("/api/recipe-costing/{$recipe->id}", [
            'notes' => 'Diperbarui',
            'ingredients' => [
                ['inventory_id' => $inventory->id, 'qty' => 5, 'unit' => 'gram'],
            ],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('recipe.total_hpp', 5000);

        $this->assertDatabaseHas('recipes', ['id' => $recipe->id, 'total_hpp' => 5000]);
    }

    public function test_update_recipe_requires_ingredients(): void
    {
        $this->actingAsOwner();
        $recipe = Recipe::factory()->create();

        $this->putJson("/api/recipe-costing/{$recipe->id}", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('ingredients');
    }

    public function test_show_returns_recipe_detail(): void
    {
        $this->actingAsOwner();
        $recipe = Recipe::factory()->create();

        $this->getJson("/api/recipe-costing/{$recipe->id}")
            ->assertOk()
            ->assertJsonStructure(['recipes', 'selectedRecipe', 'inventories', 'menus'])
            ->assertJsonPath('selectedRecipe.id', $recipe->id);
    }

    public function test_can_delete_recipe(): void
    {
        $this->actingAsOwner();
        $recipe = Recipe::factory()->create();

        $this->deleteJson("/api/recipe-costing/{$recipe->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
    }
}
