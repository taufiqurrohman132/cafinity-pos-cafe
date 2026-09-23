<?php

namespace Tests\Feature\Api;

use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsOwner(): void
    {
        $this->apiAs($this->makeUser('owner'));
    }

    public function test_guest_cannot_access_search(): void
    {
        $this->getJson('/api/search/results?q=kopi')->assertStatus(401);
    }

    public function test_index_returns_message(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/search')
            ->assertOk()
            ->assertJsonPath('message', 'Search index endpoint.');
    }

    public function test_results_returns_active_menus_matching_query(): void
    {
        $this->actingAsOwner();
        Menu::factory()->create(['name' => 'Kopi Susu', 'is_active' => true]);
        Menu::factory()->create(['name' => 'Kopi Hitam', 'is_active' => true]);
        Menu::factory()->inactive()->create(['name' => 'Kopi Lama']);
        Menu::factory()->create(['name' => 'Teh Manis', 'is_active' => true]);

        $this->getJson('/api/search/results?q=kopi')
            ->assertOk()
            ->assertJsonStructure(['results', 'query'])
            ->assertJsonPath('query', 'kopi')
            ->assertJsonCount(2, 'results');
    }

    public function test_results_without_query_returns_all_active_menus(): void
    {
        $this->actingAsOwner();
        Menu::factory()->count(3)->create(['is_active' => true]);
        Menu::factory()->count(2)->inactive()->create();

        $this->getJson('/api/search/results')
            ->assertOk()
            ->assertJsonCount(3, 'results')
            ->assertJsonPath('query', '');
    }

    public function test_results_query_must_be_string(): void
    {
        $this->actingAsOwner();

        $this->getJson('/api/search/results?q[]=array')
            ->assertStatus(422)
            ->assertJsonValidationErrors('q');
    }
}
