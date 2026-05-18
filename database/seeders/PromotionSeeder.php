<?php

namespace Database\Seeders;

use App\Models\Promotion;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $promotions = [
            ['name' => 'Weekend Bundle',    'type' => 'percentage', 'value' => 10, 'min_purchase' => 50000,  'start_date' => '2024-05-01', 'end_date' => '2024-12-31', 'is_active' => true],
            ['name' => 'Happy Hour',        'type' => 'fixed',      'value' => 5000, 'min_purchase' => 30000, 'start_date' => '2024-05-01', 'end_date' => '2024-12-31', 'is_active' => true],
            ['name' => 'Member Discount',   'type' => 'percentage', 'value' => 15, 'min_purchase' => 100000, 'start_date' => '2024-01-01', 'end_date' => '2024-12-31', 'is_active' => false],
        ];

        foreach ($promotions as $promo) {
            Promotion::create($promo);
        }
    }
}