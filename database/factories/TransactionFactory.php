<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        $total = fake()->numberBetween(10000, 200000);

        return [
            'cashier_id'    => User::factory(),
            'status'        => 'completed',
            'total_amount'  => $total,
            'discount'      => 0,
            'tax'           => 0,
            'payment_method'=> fake()->randomElement(['cash', 'qris', 'card']),
            'paid_amount'   => $total,
            'change_amount' => 0,
            'notes'         => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function held(): static
    {
        return $this->state(fn () => ['status' => 'held']);
    }

    public function refunded(): static
    {
        return $this->state(fn () => ['status' => 'refunded']);
    }
}
