<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Buat Permissions ──────────────────────────────
        $legacyPermissions = [
            'manage-users',
            'manage-menu',
            'manage-orders',
            'view-reports',
            'manage-settings',
        ];

        $modules = ['dashboard', 'pos', 'transactions', 'menus', 'recipe-costing', 'inventories', 'reports', 'users'];
        $actions = ['view', 'create', 'edit', 'delete', 'export'];

        $granularPermissions = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $granularPermissions[] = "{$module}.{$action}";
            }
        }

        $allPermissions = array_merge($legacyPermissions, $granularPermissions);

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Buat Roles & Assign Permissions ───────────────
        $owner = Role::updateOrCreate(
            ['name' => 'owner'],
            ['guard_name' => 'web', 'description' => 'Pemilik cafe dengan kontrol penuh atas seluruh sistem dan analisis bisnis.']
        );
        $owner->syncPermissions($allPermissions);

        $admin = Role::updateOrCreate(
            ['name' => 'admin'],
            ['guard_name' => 'web', 'description' => 'Administrator yang bertanggung jawab atas manajemen menu, resep, HPP, inventori, dan pemasok.']
        );
        $adminPermissions = array_merge(
            ['manage-menu', 'manage-orders', 'view-reports'],
            array_filter($granularPermissions, function ($p) {
                return !str_starts_with($p, 'users.') && !str_starts_with($p, 'settings.');
            })
        );
        $admin->syncPermissions($adminPermissions);

        $kasir = Role::updateOrCreate(
            ['name' => 'cashier'],
            ['guard_name' => 'web', 'description' => 'Personel kasir yang memproses Point of Sales (POS) dan mencatat transaksi penjualan.']
        );
        $cashierPermissions = array_merge(
            ['manage-orders'],
            array_filter($granularPermissions, function ($p) {
                return str_starts_with($p, 'pos.') || str_starts_with($p, 'transactions.');
            })
        );
        $kasir->syncPermissions($cashierPermissions);

        $kitchen = Role::updateOrCreate(
            ['name' => 'kitchen'],
            ['guard_name' => 'web', 'description' => 'Tim dapur yang memproses antrean pesanan masakan/minuman di dapur.']
        );
        $kitchenPermissions = array_filter($granularPermissions, function ($p) {
            return str_starts_with($p, 'pos.view') || str_starts_with($p, 'transactions.view');
        });
        $kitchen->syncPermissions($kitchenPermissions);

        $inventory = Role::updateOrCreate(
            ['name' => 'inventory'],
            ['guard_name' => 'web', 'description' => 'Staf inventori yang mengelola bahan baku, stok, dan supplier.']
        );
        $inventoryPermissions = array_merge(
            ['manage-menu'],
            array_filter($granularPermissions, function ($p) {
                return str_starts_with($p, 'inventories.') || str_starts_with($p, 'recipe-costing.');
            })
        );
        $inventory->syncPermissions($inventoryPermissions);

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