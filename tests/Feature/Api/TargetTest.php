<?php

namespace Tests\Feature\Api;

use App\Models\Target;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TargetTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'label' => 'Target Harian',
            'type' => 'revenue',
            'period' => 'daily',
            'target_value' => 500000,
            'start_date' => now()->toDateString(),
            'end_date' => now()->toDateString(),
        ], $overrides);
    }

    public function test_guest_cannot_access_targets(): void
    {
        $this->getJson('/api/targets-goals')->assertStatus(401);
    }

    public function test_index_returns_progress_and_history(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/targets-goals')
            ->assertOk()
            ->assertJsonStructure([
                'target',
                'targetValue',
                'currentValue',
                'progress',
                'remaining',
                'history',
                'staffPerformance',
                'peakLabel',
            ])
            ->assertJsonCount(30, 'history.labels')
            ->assertJsonCount(30, 'history.actuals')
            ->assertJsonCount(30, 'history.targets');
    }

    public function test_index_computes_progress_from_daily_target_and_revenue(): void
    {
        $this->actingAsOwner();
        Target::factory()->daily()->create(['target_value' => 500000]);
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 100000]);

        $this->getJson('/api/targets-goals?period=harian')
            ->assertOk()
            ->assertJsonPath('targetValue', 500000)
            ->assertJsonPath('currentValue', 100000)
            ->assertJsonPath('progress', 20) // round() float, ter-encode sebagai int di JSON
            ->assertJsonPath('period', 'harian');
    }

    public function test_index_period_mapping(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/targets-goals?period=bulanan')
            ->assertOk()
            ->assertJsonPath('period', 'bulanan');

        $this->getJson('/api/targets-goals?period=mingguan')
            ->assertOk()
            ->assertJsonPath('period', 'mingguan');
    }

    public function test_can_create_target(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/targets-goals', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('target.label', 'Target Harian');

        $this->assertDatabaseHas('targets', ['label' => 'Target Harian', 'target_value' => 500000]);
    }

    public function test_store_defaults_label_when_missing(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/targets-goals', $this->validPayload(['label' => null]))
            ->assertOk();

        $this->assertDatabaseHas('targets', ['label' => 'Target Umum']);
    }

    public function test_create_target_validates_fields(): void
    {
        $this->actingAsOwner();

        $this->postJson('/api/targets-goals', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['type', 'period', 'target_value', 'start_date', 'end_date']);

        $this->postJson('/api/targets-goals', $this->validPayload(['type' => 'bogus']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('type');

        $this->postJson('/api/targets-goals', $this->validPayload([
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->toDateString(),
        ]))->assertStatus(422)->assertJsonValidationErrors('end_date');
    }

    public function test_store_upserts_target_with_same_type_period_and_start_date(): void
    {
        $this->actingAsOwner();
        Target::factory()->daily()->create(['target_value' => 100000]);

        $this->postJson('/api/targets-goals', $this->validPayload(['target_value' => 999999]))
            ->assertOk();

        $this->assertSame(1, Target::count());
        $this->assertDatabaseHas('targets', ['target_value' => 999999]);
    }

    public function test_can_update_target(): void
    {
        $this->actingAsOwner();
        $target = Target::factory()->create();

        $this->putJson("/api/targets-goals/{$target->id}", $this->validPayload([
            'label' => 'Target Revisi',
            'target_value' => 750000,
        ]))->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('targets', ['id' => $target->id, 'label' => 'Target Revisi', 'target_value' => 750000]);
    }

    public function test_update_requires_label_and_returns_404_when_missing(): void
    {
        $this->actingAsOwner();
        $target = Target::factory()->create();

        $payload = $this->validPayload();
        unset($payload['label']);
        $this->putJson("/api/targets-goals/{$target->id}", $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('label');

        $this->putJson('/api/targets-goals/999999', $this->validPayload())->assertStatus(404);
    }

    public function test_can_delete_target(): void
    {
        $this->actingAsOwner();
        $target = Target::factory()->create();

        $this->deleteJson("/api/targets-goals/{$target->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('targets', ['id' => $target->id]);
    }

    public function test_show_route_is_not_exposed(): void
    {
        $this->actingAsOwner();

        // routes/api.php membatasi apiResource -> except(['show']).
        // GET jatuh ke fallback SPA GET → pastikan route API GET tidak terdaftar.
        $this->assertApiRouteNotRegistered('GET', 'api/targets-goals/{targets_goal}');
    }

    public function test_aov_endpoint_returns_metrics(): void
    {
        $this->actingAsOwner();
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 100000]);

        $this->getJson('/api/targets-goals/aov')
            ->assertOk()
            ->assertJsonStructure([
                'filters',
                'overallAov',
                'orderVolume',
                'grossRevenue',
                'chartLabels',
                'chartData',
                'heatmapSlots',
                'categoriesContribution',
            ])
            ->assertJsonPath('orderVolume', 1)
            ->assertJsonPath('grossRevenue', 100000);
    }
}
