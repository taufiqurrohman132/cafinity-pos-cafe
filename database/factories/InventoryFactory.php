<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class InventoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'inventory_category_id' => InventoryCategory::factory(),
            'supplier_id'           => Supplier::factory(),
            'name'                  => ucwords(fake()->unique()->words(2, true)),
            'unit'                  => fake()->randomElement(['gram', 'ml', 'pcs', 'liter']),
            'stock'                 => fake()->randomFloat(1, 10, 100),
            'min_stock'             => fake()->randomFloat(1, 1, 10),
            'price_per_unit'        => fake()->numberBetween(500, 10000),
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn () => [
            'stock'     => 2,
            'min_stock' => 5,
        ]);
    }
}
