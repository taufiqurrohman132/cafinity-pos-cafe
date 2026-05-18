<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Recipe;
use App\Models\Inventory;
use App\Models\RecipeIngredient;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        // Recipe: Es Kopi Susu Gula Aren
        $menu = Menu::where('name', 'Es Kopi Susu Gula Aren')->first();
        $recipe = Recipe::create(['menu_id' => $menu->id, 'notes' => 'Sajikan dengan es batu yang cukup.']);
        $this->addIngredient($recipe->id, 'Espresso Roast (Arabica)', 18, 'g');
        $this->addIngredient($recipe->id, 'Fresh Milk',               200, 'ml');
        $this->addIngredient($recipe->id, 'Gula Aren Cair',           30, 'ml');
        $this->addIngredient($recipe->id, 'Paper Cup & Lid',          1, 'pcs');

        // Recipe: Creamy Hazelnut Latte
        $menu2 = Menu::where('name', 'Creamy Hazelnut Latte')->first();
        $recipe2 = Recipe::create(['menu_id' => $menu2->id, 'notes' => 'Gunakan susu full cream untuk hasil terbaik.']);
        $this->addIngredient($recipe2->id, 'Espresso Roast (Arabica)', 18, 'g');
        $this->addIngredient($recipe2->id, 'Fresh Milk',               200, 'ml');
        $this->addIngredient($recipe2->id, 'Hazelnut Syrup',           15, 'ml');
        $this->addIngredient($recipe2->id, 'Paper Cup & Lid',          1, 'pcs');

        // Recipe: Matcha Latte Ice
        $menu3 = Menu::where('name', 'Matcha Latte Ice')->first();
        $recipe3 = Recipe::create(['menu_id' => $menu3->id, 'notes' => null]);
        $this->addIngredient($recipe3->id, 'Bubuk Matcha Premium', 5, 'g');
        $this->addIngredient($recipe3->id, 'Fresh Milk',           200, 'ml');
        $this->addIngredient($recipe3->id, 'Gula Aren Cair',       20, 'ml');
        $this->addIngredient($recipe3->id, 'Paper Cup & Lid',      1, 'pcs');
    }

    private function addIngredient(int $recipeId, string $inventoryName, float $qty, string $unit): void
    {
        $inventory = Inventory::where('name', $inventoryName)->first();
        if (!$inventory) return;

        RecipeIngredient::create([
            'recipe_id'    => $recipeId,
            'inventory_id' => $inventory->id,
            'qty'          => $qty,
            'unit'         => $unit,
        ]);
    }
}