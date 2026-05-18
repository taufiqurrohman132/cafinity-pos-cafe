<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            ['name' => 'PT Kopi Nusantara',    'phone' => '021-5550001', 'email' => 'order@kopinusantara.id',   'address' => 'Jl. Kopi No. 1, Jakarta'],
            ['name' => 'CV Dairy Fresh',        'phone' => '021-5550002', 'email' => 'supply@dairyfresh.id',     'address' => 'Jl. Susu No. 5, Bandung'],
            ['name' => 'UD Kemasan Prima',      'phone' => '021-5550003', 'email' => 'sales@kemasanprima.id',    'address' => 'Jl. Industri No. 12, Bekasi'],
            ['name' => 'Toko Bahan Kue Jaya',  'phone' => '021-5550004', 'email' => 'order@bahankuejaya.id',    'address' => 'Jl. Pasar No. 8, Jakarta'],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create([...$supplier, 'is_active' => true]);
        }
    }
}