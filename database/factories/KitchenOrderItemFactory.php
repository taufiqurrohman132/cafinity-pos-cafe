<?php

namespace Database\Factories;

use App\Models\KitchenOrder;
use App\Models\KitchenOrderItem;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KitchenOrderItem>
 */
class KitchenOrderItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'kitchen_order_id' => KitchenOrder::factory(),
            'menu_id'          => Menu::factory(),
            'qty'              => fake()->numberBetween(1, 3),
            'notes'            => null,
        ];
    }
}
