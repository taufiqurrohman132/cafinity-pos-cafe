<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.s@smartcafe.id',
                'password' => Hash::make('password'),
                'role' => 'owner'
            ],

            [
                'name' => 'Siti Aminah',
                'email' => 'siti.a@smartcafe.id',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ],

            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky.p@smartcafe.id',
                'password' => Hash::make('password'),
                'role' => 'cashier'
            ],

            [
                'name' => 'Lina Marlina',
                'email' => 'lina.m@smartcafe.id',
                'password' => Hash::make('password'),
                'role' => 'cashier'
            ],

            [
                'name' => 'Adi Wijaya',
                'email' => 'adi.w@smartcafe.id',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}