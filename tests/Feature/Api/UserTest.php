<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_users(): void
    {
        $this->getJson('/api/users')->assertStatus(401);
    }

    public function test_index_returns_users_stats_and_capability(): void
    {
        $this->actingAsOwner();
        $this->makeUser('cashier', ['name' => 'Kasir Satu']);

        $this->getJson('/api/users')
            ->assertOk()
            ->assertJsonStructure([
                'users' => ['data'],
                'stats' => ['totalKasir', 'totalAdmin', 'totalUser', 'totalActive', 'totalPending'],
                'logs',
                'filters',
                'can' => ['manage_users'],
            ])
            ->assertJsonPath('can.manage_users', true)
            ->assertJsonPath('stats.totalKasir', 1);
    }

    public function test_index_can_filter_by_role_status_and_search(): void
    {
        $this->actingAsOwner();
        $this->makeUser('cashier', ['name' => 'Kasir Cari']);
        $this->makeUser('admin', ['status' => 'inactive']);

        $this->getJson('/api/users?role=cashier')
            ->assertOk()
            ->assertJsonCount(1, 'users.data');

        $this->getJson('/api/users?status=inactive')
            ->assertOk()
            ->assertJsonCount(1, 'users.data');

        $this->getJson('/api/users?search=Cari')
            ->assertOk()
            ->assertJsonCount(1, 'users.data');
    }

    public function test_index_can_export_csv(): void
    {
        $this->actingAsOwner();
        $this->makeUser('cashier', ['name' => 'Ekspor User']);

        $response = $this->get('/api/users?export=csv')->assertOk();
        $content = $response->streamedContent();

        $this->assertStringContainsString('Nama', $content);
        $this->assertStringContainsString('Ekspor User', $content);
    }

    public function test_can_create_user_with_role(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/users', [
            'name' => 'Kasir Baru',
            'email' => 'kasir.baru@example.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'cashier',
            'status' => 'active',
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.email', 'kasir.baru@example.test');

        $user = User::where('email', 'kasir.baru@example.test')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('cashier'));
        $this->assertTrue(Hash::check('rahasia123', $user->password));
        $this->assertDatabaseHas('audit_logs', ['action' => 'Menambahkan pengguna baru: Kasir Baru']);
    }

    public function test_create_user_validates_fields(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/users', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'role']);

        $this->postJson('/api/users', [
            'name' => 'X',
            'email' => 'x@example.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'superadmin',
        ])->assertStatus(422)->assertJsonValidationErrors('role');

        $this->makeUser('cashier', ['email' => 'taken@example.test']);
        $this->postJson('/api/users', [
            'name' => 'Y',
            'email' => 'taken@example.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'cashier',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_can_update_user(): void
    {
        $this->actingAsOwner();
        $user = $this->makeUser('cashier');

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'Nama Diubah',
            'email' => $user->email,
            'role' => 'admin',
            'status' => 'inactive',
        ])->assertOk()->assertJsonPath('success', true);

        $user->refresh();
        $this->assertSame('Nama Diubah', $user->name);
        $this->assertSame('inactive', $user->status);
        $this->assertTrue($user->hasRole('admin'));
    }

    public function test_update_user_can_change_password_when_provided(): void
    {
        $this->actingAsOwner();
        $user = $this->makeUser('cashier');

        $this->putJson("/api/users/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'cashier',
            'status' => 'active',
            'password' => 'barusandi99',
            'password_confirmation' => 'barusandi99',
        ])->assertOk();

        $this->assertTrue(Hash::check('barusandi99', $user->fresh()->password));
    }

    public function test_update_user_validates_role_email_and_password(): void
    {
        $this->actingAsOwner();
        $user = $this->makeUser('cashier');
        $other = $this->makeUser('cashier', ['email' => 'other@example.test']);

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'X',
            'email' => $user->email,
            'role' => 'boss',
            'status' => 'active',
        ])->assertStatus(422)->assertJsonValidationErrors('role');

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'X',
            'email' => $other->email,
            'role' => 'cashier',
            'status' => 'active',
        ])->assertStatus(422)->assertJsonValidationErrors('email');

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'X',
            'email' => $user->email,
            'role' => 'cashier',
            'status' => 'active',
            'password' => 'pendek',
            'password_confirmation' => 'pendek',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_cannot_delete_self_but_can_delete_others(): void
    {
        $this->actingAsOwner();
        $owner = auth('sanctum')->user();
        $other = $this->makeUser('cashier');

        $this->deleteJson("/api/users/{$owner->id}")
            ->assertStatus(400)
            ->assertJsonPath('message', 'Tidak dapat menghapus akun sendiri.');

        $this->deleteJson("/api/users/{$other->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('users', ['id' => $other->id]);
    }

    public function test_can_reset_user_password(): void
    {
        $this->actingAsOwner();
        $user = $this->makeUser('cashier');

        $this->postJson("/api/users/{$user->id}/reset-password")
            ->assertOk()
            ->assertJsonPath('message', 'Password direset ke: password123');

        $this->assertTrue(Hash::check('password123', $user->fresh()->password));
    }

    public function test_can_toggle_user_status(): void
    {
        $this->actingAsOwner();
        $user = $this->makeUser('cashier', ['status' => 'active']);

        $this->postJson("/api/users/{$user->id}/toggle-status")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'status' => 'inactive']);

        $this->postJson("/api/users/{$user->id}/toggle-status")->assertOk();
        $this->assertDatabaseHas('users', ['id' => $user->id, 'status' => 'active']);
    }

    public function test_show_route_is_not_exposed(): void
    {
        $this->actingAsOwner();

        // routes/api.php membatasi apiResource -> except(['show']).
        // GET jatuh ke fallback SPA GET (routes/web.php) → 200 HTML, jadi yang
        // dipastikan adalah route API GET-nya memang tidak terdaftar.
        $this->assertApiRouteNotRegistered('GET', 'api/users/{user}');
    }
}
