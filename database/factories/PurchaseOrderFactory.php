<?php

namespace Database\Factories;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'supplier_id'       => Supplier::factory(),
            'user_id'           => User::factory(),
            'po_number'         => 'PO-' . now()->year . '-' . fake()->unique()->numberBetween(1, 9999),
            'delivery_date'     => now()->addDays(7)->toDateString(),
            'delivery_location' => 'Gudang Pusat',
            'reference_number'  => null,
            'status'            => 'pending',
            'total_amount'      => fake()->numberBetween(100000, 5000000),
            'notes'             => null,
            'created_by'        => null,
            'ordered_at'        => now(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status'     => 'approved',
            'approved_at'=> now(),
        ]);
    }
}
