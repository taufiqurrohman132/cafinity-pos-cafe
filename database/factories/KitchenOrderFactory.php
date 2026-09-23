<?php

namespace Database\Factories;

use App\Models\KitchenOrder;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KitchenOrder>
 */
class KitchenOrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'status'         => 'pending',
            'notes'          => null,
            'prepared_at'    => null,
            'completed_at'   => null,
        ];
    }

    public function preparing(): static
    {
        return $this->state(fn () => [
            'status'      => 'preparing',
            'prepared_at' => now(),
        ]);
    }

    public function ready(): static
    {
        return $this->state(fn () => ['status' => 'ready']);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status'       => 'completed',
            'prepared_at'  => now()->subMinutes(5),
            'completed_at' => now(),
        ]);
    }
}
