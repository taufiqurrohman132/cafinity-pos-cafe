<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Profil via API: PUT /api/profile (pengganti route web /profile yang sudah tidak ada).
 */
class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = $this->makeUser('cashier');
    }

    public function test_profile_information_can_be_updated(): void
    {
        $response = $this->apiAs($this->user)->putJson('/api/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.name', 'Test User')
            ->assertJsonPath('user.email', 'test@example.com');

        $this->assertSame('Test User', $this->user->fresh()->name);
        $this->assertSame('test@example.com', $this->user->fresh()->email);
    }

    public function test_profile_update_requires_name_and_valid_email(): void
    {
        $this->apiAs($this->user)->putJson('/api/profile', [
            'email' => 'not-an-email',
        ])->assertStatus(422)->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_profile_email_must_be_unique(): void
    {
        $other = $this->makeUser('cashier');

        $this->apiAs($this->user)->putJson('/api/profile', [
            'name' => $this->user->name,
            'email' => $other->email,
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_password_can_be_changed_with_correct_current_password(): void
    {
        $response = $this->apiAs($this->user)->putJson('/api/profile', [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'current_password' => 'password',
            'password' => 'new-secret-123',
            'password_confirmation' => 'new-secret-123',
        ]);

        $response->assertOk()->assertJsonPath('success', true);

        $this->assertTrue(Hash::check('new-secret-123', $this->user->fresh()->password));
        $this->assertFalse(Hash::check('password', $this->user->fresh()->password));
    }

    public function test_password_change_fails_with_wrong_current_password(): void
    {
        $this->apiAs($this->user)->putJson('/api/profile', [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'current_password' => 'wrong-password',
            'password' => 'new-secret-123',
            'password_confirmation' => 'new-secret-123',
        ])->assertStatus(422)->assertJsonValidationErrors('current_password');

        $this->assertTrue(Hash::check('password', $this->user->fresh()->password));
    }

    public function test_new_password_must_be_at_least_eight_characters(): void
    {
        $this->apiAs($this->user)->putJson('/api/profile', [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'current_password' => 'password',
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_guest_cannot_update_profile(): void
    {
        $this->putJson('/api/profile', [
            'name' => 'Hacker',
            'email' => 'hacker@example.com',
        ])->assertStatus(401);
    }
}
