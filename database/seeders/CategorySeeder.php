<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Kopi',      'description' => 'Minuman berbasis kopi'],
            ['name' => 'Non-Kopi',  'description' => 'Minuman non kopi'],
            ['name' => 'Makanan',   'description' => 'Menu makanan utama'],
            ['name' => 'Snack',     'description' => 'Camilan dan makanan ringan'],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name'        => $cat['name'],
                'slug'        => Str::slug($cat['name']),
                'description' => $cat['description'],
                'is_active'   => true,
            ]);
        }
    }
}