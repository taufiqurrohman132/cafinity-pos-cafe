<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->user = $this->makeUser('cashier');
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']])
            ->assertJsonPath('user.email', $this->user->email);

        $this->assertNotNull($this->user->fresh()->last_login);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'wrong-password',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_login_fails_with_unknown_email(): void
    {
        $this->postJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'password',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_login_requires_email_and_password(): void
    {
        $this->postJson('/api/auth/login', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_pending_user_cannot_login(): void
    {
        $pending = $this->makeUser('cashier', ['status' => 'pending']);

        $this->postJson('/api/auth/login', [
            'email' => $pending->email,
            'password' => 'password',
        ])->assertStatus(403);
    }

    public function test_deactivated_user_cannot_login(): void
    {
        $deactivated = $this->makeUser('admin', ['status' => 'deactivated']);

        $this->postJson('/api/auth/login', [
            'email' => $deactivated->email,
            'password' => 'password',
        ])->assertStatus(403);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', $this->user->email);
    }

    public function test_logout_revokes_the_token(): void
    {
        $token = $this->user->createToken('test-token')->plainTextToken;

        $this->withToken($token)->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout berhasil');

        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Simulasikan proses HTTP berikutnya yang segar: guard instance di-cache
        // antar-request dalam satu proses test, dan default guard sudah berubah
        // menjadi 'sanctum' oleh request pertama (AuthManager::shouldUse) — pada
        // proses produksi setiap request memulai dengan default guard 'web'.
        $this->app['auth']->forgetGuards();
        config(['auth.defaults.guard' => 'web']);

        $this->withToken($token)->getJson('/api/auth/me')->assertStatus(401);
    }
}
