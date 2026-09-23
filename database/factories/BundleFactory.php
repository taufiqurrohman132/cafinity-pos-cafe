<?php

namespace Database\Factories;

use App\Models\Bundle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bundle>
 */
class BundleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => ucwords(fake()->unique()->words(2, true)) . ' Bundle',
            'description' => fake()->sentence(),
            'price'       => fake()->numberBetween(30000, 100000),
            'is_active'   => true,
        ];
    }
}
