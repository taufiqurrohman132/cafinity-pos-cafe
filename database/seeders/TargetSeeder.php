<?php

namespace Database\Seeders;

use App\Models\Target;
use Illuminate\Database\Seeder;

class TargetSeeder extends Seeder
{
    public function run(): void
    {
        $targets = [
            ['label' => 'Target Pendapatan Harian',  'type' => 'revenue', 'target_value' => 14000000,  'current_value' => 1550000,   'period' => 'daily',   'start_date' => '2024-05-18', 'end_date' => '2024-05-18'],
            ['label' => 'Target Pendapatan Bulanan', 'type' => 'revenue', 'target_value' => 200000000, 'current_value' => 150000000, 'period' => 'monthly', 'start_date' => '2024-05-01', 'end_date' => '2024-05-31'],
            ['label' => 'Target Pesanan Harian',     'type' => 'orders',  'target_value' => 100,        'current_value' => 42,        'period' => 'daily',   'start_date' => '2024-05-18', 'end_date' => '2024-05-18'],
        ];

        foreach ($targets as $target) {
            Target::create($target);
        }
    }
}