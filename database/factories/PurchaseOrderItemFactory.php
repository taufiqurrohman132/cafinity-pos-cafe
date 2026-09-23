<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseOrderItem>
 */
class PurchaseOrderItemFactory extends Factory
{
    public function definition(): array
    {
        $qty   = fake()->randomFloat(1, 1, 20);
        $price = fake()->numberBetween(1000, 50000);

        return [
            'purchase_order_id' => PurchaseOrder::factory(),
            'inventory_id'      => Inventory::factory(),
            'qty'               => $qty,
            'unit'              => fake()->randomElement(['gram', 'ml', 'pcs', 'liter']),
            'price_per_unit'    => $price,
            'subtotal'          => (int) ($qty * $price),
        ];
    }
}
