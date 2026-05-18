<?php

namespace Database\Seeders;

use App\Models\InventoryCategory;
use Illuminate\Database\Seeder;

class InventoryCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Coffee Beans', 'Dairy', 'Syrups', 'Powders', 'Packaging', 'Sweeteners', 'Bakery'];

        foreach ($categories as $name) {
            InventoryCategory::create(['name' => $name]);
        }
    }
}