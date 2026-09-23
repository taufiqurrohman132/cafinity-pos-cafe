<?php

namespace Database\Factories;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'         => ucwords(fake()->unique()->words(3, true)),
            'type'         => fake()->randomElement(['percentage', 'fixed']),
            'value'        => fake()->numberBetween(5, 30),
            'min_purchase' => 0,
            'start_date'   => now()->subDay()->toDateString(),
            'end_date'     => now()->addDays(7)->toDateString(),
            'is_active'    => true,
        ];
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'start_date' => now()->subDays(30)->toDateString(),
            'end_date'   => now()->subDays(10)->toDateString(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
