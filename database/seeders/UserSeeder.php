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
        $permissions = [
            'manage-users',
            'manage-menu',
            'manage-orders',
            'view-reports',
            'manage-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Buat Roles & Assign Permissions ───────────────
        $owner = Role::firstOrCreate(['name' => 'owner']);
        $owner->givePermissionTo($permissions);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(['manage-menu', 'manage-orders', 'view-reports']);

        $kasir = Role::firstOrCreate(['name' => 'cashier']);
        $kasir->givePermissionTo(['manage-orders']);

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