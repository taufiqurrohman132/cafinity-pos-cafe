<?php

namespace Database\Factories;

use App\Models\Target;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Target>
 */
class TargetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'label'         => 'Target ' . ucwords(fake()->word()),
            'type'          => fake()->randomElement(['revenue', 'orders', 'profit']),
            'target_value'  => fake()->numberBetween(100000, 10000000),
            'current_value' => 0,
            'period'        => fake()->randomElement(['daily', 'weekly', 'monthly']),
            'start_date'    => now()->toDateString(),
            'end_date'      => now()->addDays(7)->toDateString(),
        ];
    }

    public function daily(): static
    {
        return $this->state(fn () => [
            'type'       => 'revenue',
            'period'     => 'daily',
            'start_date' => now()->toDateString(),
            'end_date'   => now()->toDateString(),
        ]);
    }
}
