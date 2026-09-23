<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    public function definition(): array
    {
        $name = ucwords(fake()->unique()->company());

        return [
            'name'         => $name,
            'phone'        => fake()->phoneNumber(),
            'email'        => fake()->unique()->companyEmail(),
            'address'      => fake()->address(),
            'city'         => fake()->city(),
            'province'     => fake()->state(),
            'category'     => fake()->randomElement(['Bahan Baku', 'Minuman', 'Perlengkapan']),
            'payment_term' => fake()->randomElement(['Net 7', 'Net 14', 'Net 30']),
            'lead_time'    => fake()->numberBetween(1, 10),
            'min_order'    => 0,
            'status'       => 'active',
            'rating'       => fake()->randomFloat(2, 3, 5),
            'notes'        => fake()->sentence(),
            'code'         => 'SUP-' . fake()->unique()->numberBetween(1, 99999),
            'is_active'    => true,
        ];
    }
}
