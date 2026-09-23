<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Permissions & Roles (shared dengan RoleSeeder) ──
        $this->call(RoleSeeder::class);

        // ── Buat Users & Assign Role ───────────────────────
        $users = [
            [
                'name'     => 'Budi Santoso',
                'email'    => 'budi.s@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'owner',
                'status'   => 'active',
            ],
            [
                'name'     => 'Siti Aminah',
                'email'    => 'siti.a@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'status'   => 'active',
            ],
            [
                'name'     => 'Rizky Pratama',
                'email'    => 'rizky.p@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'cashier',
                'status'   => 'active',
            ],
            [
                'name'     => 'Lina Marlina',
                'email'    => 'lina.m@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'cashier',
                'status'   => 'pending',
            ],
            [
                'name'     => 'Adi Wijaya',
                'email'    => 'adi.w@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'status'   => 'deactivated',
            ],
            [
                'name'     => 'Hendra Wijaya',
                'email'    => 'hendra.w@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'status'   => 'active',
            ],
            [
                'name'     => 'Dewi Lestari',
                'email'    => 'dewi.l@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'admin',
                'status'   => 'active',
            ],
            [
                'name'     => 'Rian Hidayat',
                'email'    => 'rian.h@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'cashier',
                'status'   => 'active',
            ],
            [
                'name'     => 'Maya Kartika',
                'email'    => 'maya.k@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'cashier',
                'status'   => 'inactive',
            ],
            [
                'name'     => 'Chef Junaedi',
                'email'    => 'junaedi@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'kitchen',
                'status'   => 'active',
            ],
            [
                'name'     => 'Chef Renatta',
                'email'    => 'renatta@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'kitchen',
                'status'   => 'active',
            ],
            [
                'name'     => 'Taufiq Kurrahman',
                'email'    => 'taufiq.k@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'inventory',
                'status'   => 'active',
            ],
            [
                'name'     => 'Fitri Handayani',
                'email'    => 'fitri.h@smartcafe.id',
                'password' => Hash::make('password'),
                'role'     => 'inventory',
                'status'   => 'active',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Assign Spatie role sesuai kolom role
            $user->syncRoles([$userData['role']]);
        }
    }
}