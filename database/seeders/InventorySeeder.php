<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $coffee    = InventoryCategory::where('name', 'Coffee Beans')->first()->id;
        $dairy     = InventoryCategory::where('name', 'Dairy')->first()->id;
        $syrup     = InventoryCategory::where('name', 'Syrups')->first()->id;
        $powder    = InventoryCategory::where('name', 'Powders')->first()->id;
        $packaging = InventoryCategory::where('name', 'Packaging')->first()->id;
        $sweet     = InventoryCategory::where('name', 'Sweeteners')->first()->id;
        $bakery    = InventoryCategory::where('name', 'Bakery')->first()->id;

        $sup1 = Supplier::where('name', 'PT Kopi Nusantara')->first()->id;
        $sup2 = Supplier::where('name', 'CV Dairy Fresh')->first()->id;
        $sup3 = Supplier::where('name', 'UD Kemasan Prima')->first()->id;
        $sup4 = Supplier::where('name', 'Toko Bahan Kue Jaya')->first()->id;

        $items = [
            // name, unit, stock, min_stock, price_per_unit, category, supplier
            ['Biji Kopi Arabica (House Blend)', 'kg',    8.5,  20,   240000, $coffee,    $sup1],
            ['Espresso Roast (Arabica)',         'g',     1200, 500,  350,    $coffee,    $sup1],
            ['Susu UHT Full Cream',              'liter', 42,   40,   18500,  $dairy,     $sup2],
            ['Fresh Milk',                       'ml',    15000,5000, 20,     $dairy,     $sup2],
            ['Sirup Vanilla Premium',            'botol', 3,    10,   85000,  $syrup,     $sup4],
            ['Hazelnut Syrup',                   'ml',    500,  200,  120,    $syrup,     $sup4],
            ['Gula Aren Cair',                   'liter', 0.5,  4,    110000, $sweet,     $sup4],
            ['Bubuk Cokelat Dark',               'kg',    12,   10,   125000, $powder,    $sup4],
            ['Bubuk Matcha Premium',             'kg',    2.5,  3,    350000, $powder,    $sup4],
            ['Paper Cup 12oz',                   'pcs',   150,  400,  1200,   $packaging, $sup3],
            ['Paper Cup & Lid',                  'pcs',   200,  100,  400,    $packaging, $sup3],
            ['Croissant Dough',                  'pcs',   30,   20,   8000,   $bakery,    $sup4],
            ['Almond Slice',                     'g',     500,  200,  150,    $bakery,    $sup4],
        ];

        foreach ($items as [$name, $unit, $stock, $min, $price, $catId, $supId]) {
            Inventory::create([
                'inventory_category_id' => $catId,
                'supplier_id'           => $supId,
                'name'                  => $name,
                'unit'                  => $unit,
                'stock'                 => $stock,
                'min_stock'             => $min,
                'price_per_unit'        => $price,
            ]);
        }
    }
}