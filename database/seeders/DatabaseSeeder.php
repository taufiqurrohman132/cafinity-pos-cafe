<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\InventoryCategory;
use App\Models\Menu;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name'  => 'Owner',
            'email' => 'owner@cafinity.test',
            'role'  => 'owner',
        ]);

        User::factory()->create([
            'name'  => 'Admin',
            'email' => 'admin@cafinity.test',
            'role'  => 'admin',
        ]);

        User::factory()->create([
            'name'  => 'Cashier',
            'email' => 'cashier@cafinity.test',
            'role'  => 'cashier',
        ]);

        $category = Category::create([
            'name'        => 'Coffee',
            'slug'        => 'coffee',
            'description' => 'Minuman kopi',
            'is_active'   => true,
        ]);

        Menu::create([
            'category_id' => $category->id,
            'name'        => 'Espresso',
            'slug'        => 'espresso',
            'description' => 'Single shot espresso',
            'price'       => 25000,
            'is_active'   => true,
        ]);

        Menu::create([
            'category_id' => $category->id,
            'name'        => 'Cappuccino',
            'slug'        => 'cappuccino',
            'description' => 'Espresso dengan susu',
            'price'       => 35000,
            'is_active'   => true,
        ]);

        $invCategory = InventoryCategory::create(['name' => 'Coffee Beans']);

        $supplier = Supplier::create([
            'name'      => 'Bean Supplier',
            'phone'     => '08123456789',
            'email'     => 'supplier@example.com',
            'is_active' => true,
        ]);

        Inventory::create([
            'inventory_category_id' => $invCategory->id,
            'supplier_id'           => $supplier->id,
            'name'                  => 'Arabica Beans',
            'unit'                  => 'Kg',
            'stock'                 => 10,
            'min_stock'             => 2,
            'price_per_unit'        => 150000,
        ]);
    }
}
