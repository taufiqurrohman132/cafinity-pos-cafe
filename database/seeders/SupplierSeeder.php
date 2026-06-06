<?php

namespace Database\Seeders;

use App\Models\Supplier;
use App\Models\SupplierContact;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Original suppliers to prevent breaking InventorySeeder
        $originalSuppliers = [
            [
                'name' => 'PT Kopi Nusantara',
                'phone' => '021-5550001',
                'email' => 'order@kopinusantara.id',
                'address' => 'Jl. Kopi No. 1, Jakarta',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'category' => 'Bahan Baku',
                'payment_term' => 'Net30',
                'lead_time' => 3,
                'min_order' => 1500000.00,
                'status' => 'active',
                'rating' => 4.60,
                'code' => 'SUP-0001',
                'is_active' => true,
                'contact' => [
                    'name' => 'Bambang Sudjatmiko',
                    'phone' => '081234567890',
                    'email' => 'bambang@kopinusantara.id',
                    'position' => 'Sales Manager',
                ]
            ],
            [
                'name' => 'CV Dairy Fresh',
                'phone' => '021-5550002',
                'email' => 'supply@dairyfresh.id',
                'address' => 'Jl. Susu No. 5, Bandung',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'category' => 'Bahan Baku',
                'payment_term' => 'Net14',
                'lead_time' => 2,
                'min_order' => 1000000.00,
                'status' => 'active',
                'rating' => 4.40,
                'code' => 'SUP-0002',
                'is_active' => true,
                'contact' => [
                    'name' => 'Siti Aminah',
                    'phone' => '081298765432',
                    'email' => 'siti@dairyfresh.id',
                    'position' => 'Account Manager',
                ]
            ],
            [
                'name' => 'UD Kemasan Prima',
                'phone' => '021-5550003',
                'email' => 'sales@kemasanprima.id',
                'address' => 'Jl. Industri No. 12, Bekasi',
                'city' => 'Bekasi',
                'province' => 'Jawa Barat',
                'category' => 'Packaging',
                'payment_term' => 'Net30',
                'lead_time' => 4,
                'min_order' => 750000.00,
                'status' => 'active',
                'rating' => 4.10,
                'code' => 'SUP-0003',
                'is_active' => true,
                'contact' => [
                    'name' => 'Joko Widodo',
                    'phone' => '081345678901',
                    'email' => 'joko@kemasanprima.id',
                    'position' => 'Logistics Head',
                ]
            ],
            [
                'name' => 'Toko Bahan Kue Jaya',
                'phone' => '021-5550004',
                'email' => 'order@bahankuejaya.id',
                'address' => 'Jl. Pasar No. 8, Jakarta',
                'city' => 'Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'category' => 'Bahan Baku',
                'payment_term' => 'COD',
                'lead_time' => 1,
                'min_order' => 250000.00,
                'status' => 'active',
                'rating' => 4.50,
                'code' => 'SUP-0004',
                'is_active' => true,
                'contact' => [
                    'name' => 'Dewi Lestari',
                    'phone' => '081267890123',
                    'email' => 'dewi@bahankuejaya.id',
                    'position' => 'Store Owner',
                ]
            ],
        ];

        // 2. Mockup Suppliers exactly from Visly Mockup
        $mockupSuppliers = [
            [
                'name' => 'Global Tech Solutions',
                'phone' => '021-8880001',
                'email' => 'info@globaltech.id',
                'address' => 'Sudirman Central Business District',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'category' => 'Elektronik',
                'payment_term' => 'Net30',
                'lead_time' => 3,
                'min_order' => 1000000.00,
                'status' => 'active',
                'rating' => 4.80,
                'code' => 'SUP-1001',
                'is_active' => true,
                'contact' => [
                    'name' => 'Budi Santoso',
                    'phone' => '081111222333',
                    'email' => 'budi.santoso@globaltech.id',
                    'position' => 'Finance Manager',
                ]
            ],
            [
                'name' => 'Astra Corp Indonesia',
                'phone' => '021-8880002',
                'email' => 'procurement@astracorp.co.id',
                'address' => 'Sunter II, Tj. Priok',
                'city' => 'Jakarta Utara',
                'province' => 'DKI Jakarta',
                'category' => 'Otomotif',
                'payment_term' => 'Net14',
                'lead_time' => 5,
                'min_order' => 5000000.00,
                'status' => 'active',
                'rating' => 4.50,
                'code' => 'SUP-1002',
                'is_active' => true,
                'contact' => [
                    'name' => 'Sari Wijaya',
                    'phone' => '081122334455',
                    'email' => 'sari.wijaya@astracorp.co.id',
                    'position' => 'Finance Manager',
                ]
            ],
            [
                'name' => 'Maju Jaya Logistik',
                'phone' => '021-8880003',
                'email' => 'ops@majujayalogistik.com',
                'address' => 'Kawasan Industri Pulogadung',
                'city' => 'Jakarta Timur',
                'province' => 'DKI Jakarta',
                'category' => 'Logistik',
                'payment_term' => 'COD',
                'lead_time' => 2,
                'min_order' => 0.00,
                'status' => 'inactive',
                'rating' => 3.90,
                'code' => 'SUP-1003',
                'is_active' => false,
                'contact' => [
                    'name' => 'Andi Pratama',
                    'phone' => '081133445566',
                    'email' => 'andi.pratama@majujayalogistik.com',
                    'position' => 'Finance Manager',
                ]
            ],
            [
                'name' => 'Sinar Mas Trading',
                'phone' => '021-8880004',
                'email' => 'sales@sinarmastrading.com',
                'address' => 'Thamrin Kav. 22',
                'city' => 'Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'category' => 'FMCG',
                'payment_term' => 'Net30',
                'lead_time' => 7,
                'min_order' => 2500000.00,
                'status' => 'active',
                'rating' => 4.20,
                'code' => 'SUP-1004',
                'is_active' => true,
                'contact' => [
                    'name' => 'Linda Kusuma',
                    'phone' => '081144556677',
                    'email' => 'linda.kusuma@sinarmastrading.com',
                    'position' => 'Finance Manager',
                ]
            ],
            [
                'name' => 'Indo Build Materials',
                'phone' => '021-8880005',
                'email' => 'sales@indobuild.co.id',
                'address' => 'Gading Serpong, Tangerang',
                'city' => 'Tangerang',
                'province' => 'Banten',
                'category' => 'Konstruksi',
                'payment_term' => 'Net7',
                'lead_time' => 10,
                'min_order' => 10000000.00,
                'status' => 'blacklist',
                'rating' => 2.50,
                'code' => 'SUP-1005',
                'is_active' => false,
                'contact' => [
                    'name' => 'Hendra Setiawan',
                    'phone' => '081155667788',
                    'email' => 'hendra.setiawan@indobuild.co.id',
                    'position' => 'Finance Manager',
                ]
            ],
        ];

        $allSuppliers = array_merge($originalSuppliers, $mockupSuppliers);

        foreach ($allSuppliers as $supData) {
            $contact = $supData['contact'];
            unset($supData['contact']);

            $supplier = Supplier::create($supData);

            SupplierContact::create([
                'supplier_id' => $supplier->id,
                'name' => $contact['name'],
                'phone' => $contact['phone'],
                'email' => $contact['email'],
                'position' => $contact['position'],
                'is_primary' => true,
            ]);
        }
    }
}