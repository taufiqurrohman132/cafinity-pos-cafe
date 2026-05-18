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
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            MenuSeeder::class,
            SupplierSeeder::class,
            InventoryCategorySeeder::class,
            InventorySeeder::class,
            RecipeSeeder::class,
            TransactionSeeder::class,
            KitchenOrderSeeder::class,
            PromotionSeeder::class,
            TargetSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
