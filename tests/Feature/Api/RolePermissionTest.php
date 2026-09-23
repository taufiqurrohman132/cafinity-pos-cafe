<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_role_management(): void
    {
        $this->getJson('/api/user-management/role-permission')->assertStatus(401);
    }

    public function test_index_returns_roles_with_permissions_and_logs(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/user-management/role-permission')
            ->assertOk()
            ->assertJsonStructure(['roles', 'logs', 'filters'])
            ->assertJsonCount(5, 'roles'); // owner, admin, cashier, kitchen, inventory
    }

    public function test_index_can_search_roles(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/user-management/role-permission?search=kitchen')
            ->assertOk()
            ->assertJsonCount(1, 'roles')
            ->assertJsonPath('roles.0.name', 'kitchen');
    }

    public function test_can_create_role_with_permissions(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/user-management/role-permission', [
            'name' => 'Supervisor',
            'description' => 'Supervisor shift',
            'permissions' => ['manage-menu', 'view-reports'],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('role.name', 'Supervisor');

        $role = Role::where('name', 'Supervisor')->first();
        $this->assertNotNull($role);
        $this->assertTrue($role->hasPermissionTo('manage-menu'));
        $this->assertTrue($role->hasPermissionTo('view-reports'));
    }

    public function test_create_role_validates_name_and_permissions(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/user-management/role-permission', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');

        $this->postJson('/api/user-management/role-permission', [
            'name' => 'Duplikat Owner',
            'permissions' => ['owner'],
        ])->assertStatus(422);

        $this->postJson('/api/user-management/role-permission', [
            'name' => 'Role Unik',
            'permissions' => ['tidak.ada'],
        ])->assertStatus(422)->assertJsonValidationErrors('permissions.0');
    }

    public function test_role_name_must_be_unique_on_create(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/user-management/role-permission', ['name' => 'owner'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_can_update_role(): void
    {
        $this->actingAsOwner();
        $role = Role::create(['name' => 'Lama', 'guard_name' => 'web']);

        $this->putJson("/api/user-management/role-permission/{$role->id}", [
            'name' => 'Baru',
            'description' => 'Diganti',
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Baru', 'description' => 'Diganti']);
    }

    public function test_update_rejects_duplicate_name(): void
    {
        $this->actingAsOwner();
        $role = Role::create(['name' => 'Satu', 'guard_name' => 'web']);
        Role::create(['name' => 'Dua', 'guard_name' => 'web']);

        $this->putJson("/api/user-management/role-permission/{$role->id}", ['name' => 'Dua'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');

        // nama sendiri tetap boleh
        $this->putJson("/api/user-management/role-permission/{$role->id}", ['name' => 'Satu'])
            ->assertOk();
    }

    public function test_cannot_delete_system_roles(): void
    {
        $this->actingAsOwner();
        $ownerRole = Role::where('name', 'owner')->first();

        $this->deleteJson("/api/user-management/role-permission/{$ownerRole->id}")
            ->assertStatus(400)
            ->assertJsonPath('message', 'Role bawaan sistem diproteksi dan tidak dapat dihapus.');

        $this->assertNotNull($ownerRole->fresh());
    }

    public function test_can_delete_custom_role(): void
    {
        $this->actingAsOwner();
        $role = Role::create(['name' => 'Sementara', 'guard_name' => 'web']);

        $this->deleteJson("/api/user-management/role-permission/{$role->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    public function test_can_update_role_permissions(): void
    {
        $this->actingAsOwner();
        $role = Role::where('name', 'cashier')->first();

        $this->putJson("/api/user-management/role-permission/{$role->id}/permissions", [
            'permissions' => ['pos.view', 'pos.create'],
        ])->assertOk()->assertJsonPath('success', true);

        $permissions = $role->fresh()->permissions->pluck('name')->all();
        $this->assertEqualsCanonicalizing(['pos.view', 'pos.create'], $permissions);
    }

    public function test_update_permissions_requires_and_validates_field(): void
    {
        $this->actingAsOwner();
        $role = Role::where('name', 'cashier')->first();

        $this->putJson("/api/user-management/role-permission/{$role->id}/permissions", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('permissions');

        $this->putJson("/api/user-management/role-permission/{$role->id}/permissions", [
            'permissions' => ['ngawur'],
        ])->assertStatus(422)->assertJsonValidationErrors('permissions.0');
    }

    public function test_index_shows_recent_role_activity_logs(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/user-management/role-permission', ['name' => 'Barista'])
            ->assertOk();

        $this->getJson('/api/user-management/role-permission')
            ->assertOk()
            ->assertJsonCount(1, 'logs')
            ->assertJsonPath('logs.0.action', 'Membuat peran baru: Barista');
    }
}
