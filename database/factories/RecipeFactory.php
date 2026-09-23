<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Recipe>
 */
class RecipeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'menu_id'   => Menu::factory(),
            'notes'     => fake()->sentence(),
            'total_hpp' => fake()->numberBetween(1000, 20000),
        ];
    }
}
