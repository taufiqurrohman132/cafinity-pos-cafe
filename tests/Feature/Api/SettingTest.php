<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_settings(): void
    {
        $this->getJson('/api/settings')->assertStatus(401);
    }

    public function test_index_returns_settings_with_defaults(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.cafe_name', 'SmartCafe Sudirman')
            ->assertJsonPath('settings.tax_rate', '12');
    }

    public function test_index_returns_saved_settings_over_defaults(): void
    {
        $this->actingAsOwner();
        Setting::factory()->create(['key' => 'cafe_name', 'value' => 'Kafe Sudirman Lama']);

        $this->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.cafe_name', 'Kafe Sudirman Lama');
    }

    public function test_can_update_general_settings(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/general', [
            'cafe_name' => 'Kafe Baru',
            'cafe_email' => 'halo@kafe.test',
            'tax_rate' => 11,
        ])->assertOk()
            ->assertJsonPath('message', 'Pengaturan bisnis berhasil disimpan.')
            ->assertJsonPath('settings.cafe_name', 'Kafe Baru');

        $this->assertDatabaseHas('settings', ['key' => 'cafe_name', 'value' => 'Kafe Baru', 'group' => 'general']);
        $this->assertDatabaseHas('settings', ['key' => 'tax_rate', 'value' => '11']);
    }

    public function test_general_settings_validates_email_and_numeric(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/general', ['cafe_email' => 'bukan-email'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('cafe_email');

        $this->putJson('/api/settings/general', ['tax_rate' => 'abc'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('tax_rate');
    }

    public function test_can_update_operational_hours_as_array(): void
    {
        $this->actingAsOwner();
        $hours = [
            'Senin' => ['active' => true, 'open' => '07:00', 'close' => '21:00'],
        ];

        $this->putJson('/api/settings/general', ['operational_hours' => $hours])
            ->assertOk();

        $stored = Setting::where('key', 'operational_hours')->value('value');
        $this->assertSame($hours, json_decode($stored, true));
    }

    public function test_can_update_security_settings(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/security', [
            'session_timeout' => 30,
            'require_2fa' => true,
        ])->assertOk()
            ->assertJsonPath('message', 'Pengaturan keamanan disimpan.');

        $this->assertDatabaseHas('settings', ['key' => 'session_timeout', 'value' => '30', 'group' => 'security']);
        $this->assertDatabaseHas('settings', ['key' => 'require_2fa', 'value' => '1']);
    }

    public function test_security_settings_validates_minimum_timeout(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/security', ['session_timeout' => 3])
            ->assertStatus(422)
            ->assertJsonValidationErrors('session_timeout');
    }

    public function test_can_update_appearance_settings(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/appearance', [
            'theme' => 'dark',
            'accent_color' => '#BFFF00',
        ])->assertOk()
            ->assertJsonPath('message', 'Pengaturan tampilan disimpan.')
            ->assertJsonPath('settings.theme', 'dark');

        $this->assertDatabaseHas('settings', ['key' => 'theme', 'value' => 'dark', 'group' => 'appearance']);
    }

    public function test_appearance_settings_reject_unknown_theme(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/settings/appearance', ['theme' => 'neon'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('theme');
    }
}
