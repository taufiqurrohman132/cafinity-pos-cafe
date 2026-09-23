<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * Unit test definisi Gate di AppServiceProvider:
 * - Gate::before bypass milik role owner
 * - Gate::define 'manage-*' memetakan ke permission granular Spatie
 * - manage-settings punya cabang role admin
 */
class GateTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_bypasses_every_ability_via_gate_before(): void
    {
        $owner = $this->makeUser('owner');

        // Sebelum diberi permission apa pun pun, owner tetap lolos semua ability.
        $this->assertTrue(Gate::forUser($owner)->allows('manage-users'));
        $this->assertTrue(Gate::forUser($owner)->allows('manage-menu'));
        $this->assertTrue(Gate::forUser($owner)->allows('manage-orders'));
        $this->assertTrue(Gate::forUser($owner)->allows('view-reports'));
        $this->assertTrue(Gate::forUser($owner)->allows('manage-settings'));
        // Ability yang tidak terdaftar pun lolos (before → true).
        $this->assertTrue(Gate::forUser($owner)->allows('nonexistent-ability'));
    }

    public function test_manage_users_requires_any_users_permission(): void
    {
        $cashier = $this->makeUser('cashier');
        $this->assertFalse(Gate::forUser($cashier)->allows('manage-users'));

        $cashier->syncPermissions(['users.view']);

        $this->assertTrue(Gate::forUser($cashier)->allows('manage-users'));
    }

    public function test_manage_menu_aggregates_menu_recipe_inventory_permissions(): void
    {
        $user = $this->makeUser('cashier');
        $this->assertFalse(Gate::forUser($user)->allows('manage-menu'));

        // Permission dari modul recipe-costing saja sudah cukup.
        $user->syncPermissions(['recipe-costing.view']);
        $this->assertTrue(Gate::forUser($user)->allows('manage-menu'));
    }

    public function test_manage_orders_aggregates_pos_and_transactions_permissions(): void
    {
        // Role cashier sudah dibekali permission pos/transactions (lihat RoleSeeder),
        // jadi gunakan user tanpa role Spatie untuk menguji jalur agregasinya.
        $this->seedRoles();
        $user = User::factory()->create(['role' => 'cashier', 'status' => 'active']);
        $this->assertFalse(Gate::forUser($user)->allows('manage-orders'));

        $user->syncPermissions(['transactions.view']);
        $this->assertTrue(Gate::forUser($user)->allows('manage-orders'));
    }

    public function test_view_reports_requires_reports_permission(): void
    {
        $user = $this->makeUser('cashier');
        $this->assertFalse(Gate::forUser($user)->allows('view-reports'));

        $user->syncPermissions(['reports.export']);
        $this->assertTrue(Gate::forUser($user)->allows('view-reports'));
    }

    public function test_manage_settings_allows_admin_role_without_permission(): void
    {
        $admin = $this->makeUser('admin');

        // Cabang `hasRole('admin')` pada manage-settings.
        $this->assertTrue(Gate::forUser($admin)->allows('manage-settings'));
    }

    public function test_manage_settings_denies_plain_cashier(): void
    {
        $cashier = $this->makeUser('cashier');

        $this->assertFalse(Gate::forUser($cashier)->allows('manage-settings'));
    }

    public function test_user_without_role_still_evaluates_defines_normally(): void
    {
        // User tanpa role Spatie: before → false, lalu define dijalankan dengan
        // hasAnyPermission → false (tidak ada permission).
        $plain = User::factory()->create(['role' => 'cashier', 'status' => 'active']);

        $this->assertFalse(Gate::forUser($plain)->allows('manage-users'));
        $this->assertFalse(Gate::forUser($plain)->allows('manage-menu'));
    }
}
