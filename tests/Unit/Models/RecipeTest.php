<?php

namespace Tests\Unit\Models;

use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit test kalkulasi HPP & margin model Recipe.
 */
class RecipeTest extends TestCase
{
    use RefreshDatabase;

    private function makeMenu(int $price): Menu
    {
        return Menu::factory()->create(['price' => $price]);
    }

    public function test_recalculate_hpp_sums_ingredient_cost(): void
    {
        // HPP = Σ(qty × price_per_unit) seluruh bahan.
        $invA = Inventory::factory()->create(['price_per_unit' => 10000]);
        $invB = Inventory::factory()->create(['price_per_unit' => 2500]);

        $recipe = Recipe::create(['menu_id' => $this->makeMenu(40000)->id, 'total_hpp' => 0]);
        $recipe->ingredients()->attach($invA->id, ['qty' => 2, 'unit' => 'g']);
        $recipe->ingredients()->attach($invB->id, ['qty' => 4, 'unit' => 'ml']);

        // RecipeObserver::saved me-load relasi 'ingredients' saat create (masih kosong)
        // dan meng-cache-nya; attach pivot tidak meng-invalidate cache itu.
        // Reload dulu — sama seperti yang dilakukan RecipeController setelah attach.
        $recipe->load('ingredients');

        $recipe->recalculateHpp();

        // (2 × 10000) + (4 × 2500) = 30000
        $this->assertSame(30000, $recipe->fresh()->total_hpp);
    }

    public function test_recalculate_keeps_manual_hpp_when_no_ingredients(): void
    {
        // Tidak ada bahan terdaftar → HPP manual tidak boleh ditimpa (jadi 0).
        $recipe = Recipe::create([
            'menu_id'   => $this->makeMenu(40000)->id,
            'total_hpp' => 12345,
        ]);

        $recipe->recalculateHpp();

        $this->assertSame(12345, $recipe->fresh()->total_hpp);
    }

    public function test_margin_is_percentage_of_price_minus_hpp(): void
    {
        $menu = $this->makeMenu(40000);
        $recipe = Recipe::create(['menu_id' => $menu->id, 'total_hpp' => 30000]);
        $recipe->setRelation('menu', $menu);

        // ((40000 − 30000) / 40000) × 100 = 25.0%
        $this->assertSame(25.0, $recipe->margin);
    }

    public function test_margin_is_zero_when_price_is_zero(): void
    {
        $menu = $this->makeMenu(0);
        $recipe = Recipe::create(['menu_id' => $menu->id, 'total_hpp' => 5000]);
        $recipe->setRelation('menu', $menu);

        // getMarginAttribute(): float — cabang price 0 mengembalikan 0 yang
        // di-coerce return type menjadi 0.0.
        $this->assertSame(0.0, $recipe->margin);
    }
}
