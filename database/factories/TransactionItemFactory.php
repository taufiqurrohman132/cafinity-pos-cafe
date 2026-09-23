<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TransactionItem>
 */
class TransactionItemFactory extends Factory
{
    public function definition(): array
    {
        $qty    = fake()->numberBetween(1, 3);
        $price  = fake()->randomElement([15000, 20000, 25000]);

        return [
            'transaction_id' => Transaction::factory(),
            'menu_id'        => Menu::factory(),
            'qty'            => $qty,
            'price'          => $price,
            'discount'       => 0,
            'subtotal'       => $qty * $price,
            'notes'          => null,
        ];
    }
}
