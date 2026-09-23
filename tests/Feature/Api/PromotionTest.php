<?php

namespace Tests\Feature\Api;

use App\Models\Promotion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Promo Gajian',
            'type' => 'percentage',
            'value' => 15,
            'min_purchase' => 50000,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDays(7)->toDateString(),
            'is_active' => true,
        ], $overrides);
    }

    public function test_guest_cannot_access_promotions(): void
    {
        $this->getJson('/api/promotions')->assertStatus(401);
    }

    public function test_index_returns_campaigns_and_stats(): void
    {
        $this->actingAsOwner();
        Promotion::factory()->create(['name' => 'Promo Aktif']);

        $this->getJson('/api/promotions')
            ->assertOk()
            ->assertJsonStructure([
                'totalRedemptions',
                'estimasiRevenue',
                'kampanyeAktif',
                'efisiensiPromo',
                'campaigns',
                'highlightCampaign',
                'menus',
                'chartLabels',
                'chartData',
            ])
            ->assertJsonPath('campaigns.0.name', 'Promo Aktif')
            ->assertJsonPath('campaigns.0.status', 'Aktif');
    }

    public function test_index_falls_back_to_default_campaign_when_empty(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/promotions')
            ->assertOk()
            ->assertJsonPath('campaigns.0.name', 'Weekend Bundle');
    }

    public function test_expired_promotion_is_marked_selesai(): void
    {
        $this->actingAsOwner();
        Promotion::factory()->expired()->create(['name' => 'Promo Lama']);

        $this->getJson('/api/promotions')
            ->assertOk()
            ->assertJsonPath('campaigns.0.status', 'Selesai');
    }

    public function test_inactive_promotion_is_marked_selesai(): void
    {
        $this->actingAsOwner();
        Promotion::factory()->inactive()->create(['name' => 'Promo Mati']);

        $this->getJson('/api/promotions')
            ->assertOk()
            ->assertJsonPath('campaigns.0.status', 'Selesai');
    }

    public function test_can_create_promotion(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/promotions', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('promotion.name', 'Promo Gajian');

        $this->assertDatabaseHas('promotions', ['name' => 'Promo Gajian', 'type' => 'percentage', 'value' => 15]);
    }

    public function test_create_promotion_validates_required_fields(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/promotions', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'type', 'value', 'start_date', 'end_date']);
    }

    public function test_create_promotion_rejects_invalid_type_and_date_range(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/promotions', $this->validPayload(['type' => 'bogus']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('type');

        $this->postJson('/api/promotions', $this->validPayload([
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->toDateString(),
        ]))->assertStatus(422)->assertJsonValidationErrors('end_date');
    }

    public function test_show_route_is_not_exposed(): void
    {
        $this->actingAsOwner();

        // routes/api.php membatasi apiResource -> except(['show']).
        // GET jatuh ke fallback SPA GET → pastikan route API GET tidak terdaftar.
        $this->assertApiRouteNotRegistered('GET', 'api/promotions/{promotion}');
    }

    public function test_can_update_promotion(): void
    {
        $this->actingAsOwner();
        $promotion = Promotion::factory()->create();

        $this->putJson("/api/promotions/{$promotion->id}", $this->validPayload([
            'name' => 'Promo Updated',
            'type' => 'fixed',
            'value' => 10000,
        ]))->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('promotions', [
            'id' => $promotion->id,
            'name' => 'Promo Updated',
            'type' => 'fixed',
            'value' => 10000,
        ]);
    }

    public function test_update_returns_404_for_missing_promotion(): void
    {
        $this->actingAsOwner();

        $this->putJson('/api/promotions/999999', $this->validPayload())->assertStatus(404);
    }

    public function test_can_delete_promotion(): void
    {
        $this->actingAsOwner();
        $promotion = Promotion::factory()->create();

        $this->deleteJson("/api/promotions/{$promotion->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('promotions', ['id' => $promotion->id]);
    }
}
