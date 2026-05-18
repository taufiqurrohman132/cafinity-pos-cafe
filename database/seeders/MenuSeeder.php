<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $kopi     = Category::where('name', 'Kopi')->first()->id;
        $nonKopi  = Category::where('name', 'Non-Kopi')->first()->id;
        $makanan  = Category::where('name', 'Makanan')->first()->id;
        $snack    = Category::where('name', 'Snack')->first()->id;

        $menus = [
            // Kopi
            ['category_id' => $kopi,    'name' => 'Es Kopi Susu Gula Aren',     'price' => 25000, 'is_active' => true,  'description' => 'Perpaduan espresso, susu segar, dan gula aren asli.'],
            ['category_id' => $kopi,    'name' => 'Caffe Latte Hot',             'price' => 28000, 'is_active' => true,  'description' => 'Espresso dengan susu steamed creamy.'],
            ['category_id' => $kopi,    'name' => 'Caramel Macchiato',           'price' => 35000, 'is_active' => true,  'description' => 'Espresso dengan saus karamel dan susu.'],
            ['category_id' => $kopi,    'name' => 'Signature Espresso',          'price' => 28000, 'is_active' => true,  'description' => 'Espresso single origin house blend.'],
            ['category_id' => $kopi,    'name' => 'Cappuccino Hot',              'price' => 30000, 'is_active' => true,  'description' => 'Espresso dengan foam susu lembut.'],
            ['category_id' => $kopi,    'name' => 'Americano',                   'price' => 22000, 'is_active' => true,  'description' => 'Espresso dengan air panas.'],
            ['category_id' => $kopi,    'name' => 'Creamy Hazelnut Latte',       'price' => 35000, 'is_active' => true,  'description' => 'Latte dengan sirup hazelnut premium.'],

            // Non-Kopi
            ['category_id' => $nonKopi, 'name' => 'Matcha Latte Ice',            'price' => 32000, 'is_active' => true,  'description' => 'Matcha grade premium dengan susu segar.'],
            ['category_id' => $nonKopi, 'name' => 'Red Velvet Latte',            'price' => 30000, 'is_active' => true,  'description' => 'Minuman red velvet dengan susu creamy.'],
            ['category_id' => $nonKopi, 'name' => 'Matcha Zen Smoothie',         'price' => 38000, 'is_active' => true,  'description' => 'Smoothie matcha dengan yogurt dan madu.'],
            ['category_id' => $nonKopi, 'name' => 'Avocado Juice',               'price' => 30000, 'is_active' => true,  'description' => 'Jus alpukat segar dengan susu cokelat.'],
            ['category_id' => $nonKopi, 'name' => 'Ice Lemon Tea',               'price' => 18000, 'is_active' => true,  'description' => 'Teh lemon segar dengan es batu.'],

            // Makanan
            ['category_id' => $makanan, 'name' => 'Nasi Goreng Spesial Java',    'price' => 45000, 'is_active' => true,  'description' => 'Nasi goreng dengan telur, ayam, dan sayuran.'],
            ['category_id' => $makanan, 'name' => 'Beef Lasagna',                'price' => 45000, 'is_active' => false, 'description' => 'Lasagna daging sapi dengan saus bechamel.'],
            ['category_id' => $makanan, 'name' => 'Spaghetti Carbonara',         'price' => 48000, 'is_active' => true,  'description' => 'Pasta carbonara dengan daging asap.'],
            ['category_id' => $makanan, 'name' => 'Classic Beef Burger',         'price' => 55000, 'is_active' => true,  'description' => 'Burger daging sapi dengan sayuran segar.'],
            ['category_id' => $makanan, 'name' => 'Beef Burger Combo',           'price' => 65000, 'is_active' => true,  'description' => 'Burger + kentang goreng + minuman.'],
            ['category_id' => $makanan, 'name' => 'Ayam Geprek Sambal Matah',    'price' => 42000, 'is_active' => true,  'description' => 'Ayam geprek dengan sambal matah khas Bali.'],

            // Snack
            ['category_id' => $snack,   'name' => 'Croissant Almond Butter',     'price' => 24000, 'is_active' => true,  'description' => 'Croissant dengan almond dan mentega.'],
            ['category_id' => $snack,   'name' => 'Croissant Butter',            'price' => 20000, 'is_active' => true,  'description' => 'Croissant original dengan mentega premium.'],
            ['category_id' => $snack,   'name' => 'French Fries',                'price' => 22000, 'is_active' => true,  'description' => 'Kentang goreng renyah dengan saus.'],
        ];

        foreach ($menus as $menu) {
            Menu::create([
                'category_id' => $menu['category_id'],
                'name'        => $menu['name'],
                'slug'        => Str::slug($menu['name']),
                'description' => $menu['description'],
                'price'       => $menu['price'],
                'is_active'   => $menu['is_active'],
            ]);
        }
    }
}