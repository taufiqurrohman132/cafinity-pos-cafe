<?php

namespace Tests\Unit\Models;

use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Support\Collection;
use Tests\TestCase;

/**
 * Unit test accessor/appended attribute model Menu (tanpa query saat
 * relasi sudah di-setRelation).
 */
class MenuTest extends TestCase
{
    public function test_image_url_is_null_when_image_is_empty(): void
    {
        $menu = new Menu(['image' => null]);

        $this->assertNull($menu->image_url);
    }

    public function test_image_url_uses_storage_url_when_image_set(): void
    {
        $menu = new Menu(['image' => 'menus/kopi.jpg']);

        $this->assertStringContainsString('menus/kopi.jpg', $menu->image_url);
    }

    public function test_hpp_is_zero_when_recipe_relation_is_null(): void
    {
        $menu = new Menu();
        // Hindari query: relasi sudah "loaded" (null) → accessor tidak memanggil DB.
        $menu->setRelation('recipe', null);

        $this->assertSame(0, $menu->hpp);
    }

    public function test_hpp_reads_total_hpp_from_loaded_recipe(): void
    {
        $menu = new Menu();
        $recipe = new Recipe(['total_hpp' => 17500]);
        $menu->setRelation('recipe', $recipe);

        $this->assertSame(17500, $menu->hpp);
    }

    public function test_active_bundle_is_first_loaded_bundle_or_null(): void
    {
        $menu = new Menu();
        $menu->setRelation('activeBundle', new Collection());

        $this->assertNull($menu->active_bundle);
    }

    public function test_stub_accessors_have_stable_values(): void
    {
        $menu = new Menu(['name' => 'Kopi Susu', 'price' => 25000]);

        // profit_trend & is_best_seller masih stub (dokumentasi kontrak saat ini).
        $this->assertNull($menu->profit_trend);
        $this->assertFalse($menu->is_best_seller);
    }

    public function test_price_and_boolean_casts(): void
    {
        $menu = new Menu(['price' => '30000', 'is_active' => 1]);

        $this->assertSame(30000, $menu->price);
        $this->assertTrue($menu->is_active);
    }
}
