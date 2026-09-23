<?php

namespace Tests\Feature\Api;

use App\Events\OrderReady;
use App\Models\KitchenOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class KitchenOrderTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsKitchen(): void
    {
        $this->apiAs($this->makeUser('kitchen'));
    }

    public function test_guest_cannot_access_kitchen_orders(): void
    {
        $this->getJson('/api/kitchen-orders')->assertStatus(401);
    }

    public function test_index_returns_active_orders_with_stats(): void
    {
        $this->actingAsKitchen();
        KitchenOrder::factory()->create(['status' => 'pending']);
        KitchenOrder::factory()->preparing()->create();
        KitchenOrder::factory()->ready()->create();
        KitchenOrder::factory()->completed()->create(); // tidak ikut antrean

        $this->getJson('/api/kitchen-orders')
            ->assertOk()
            ->assertJsonStructure([
                'orders',
                'filter',
                'stats' => ['active_orders', 'late_orders', 'completed_today', 'avg_cook_time'],
            ])
            ->assertJsonCount(3, 'orders')
            ->assertJsonPath('stats.active_orders', 2)
            ->assertJsonPath('stats.completed_today', 1);
    }

    public function test_index_can_filter_by_status(): void
    {
        $this->actingAsKitchen();
        KitchenOrder::factory()->create(['status' => 'pending']);
        KitchenOrder::factory()->ready()->create();

        $this->getJson('/api/kitchen-orders?filter=ready')
            ->assertOk()
            ->assertJsonCount(1, 'orders')
            ->assertJsonPath('filter', 'ready')
            ->assertJsonPath('orders.0.status', 'ready');
    }

    public function test_show_returns_order_detail(): void
    {
        $this->actingAsKitchen();
        $order = KitchenOrder::factory()->create();

        $this->getJson("/api/kitchen-orders/{$order->id}")
            ->assertOk()
            ->assertJsonStructure(['order' => ['id', 'status', 'items']]);
    }

    public function test_show_returns_404_for_missing_order(): void
    {
        $this->actingAsKitchen();
        $this->getJson('/api/kitchen-orders/999999')->assertStatus(404);
    }

    public function test_can_prepare_order(): void
    {
        $this->actingAsKitchen();
        $order = KitchenOrder::factory()->create(['status' => 'pending', 'prepared_at' => null]);

        $this->postJson("/api/kitchen-orders/{$order->id}/prepare")
            ->assertOk()
            ->assertJsonPath('order.status', 'preparing');

        $order->refresh();
        $this->assertSame('preparing', $order->status);
        $this->assertNotNull($order->prepared_at);
    }

    public function test_ready_order_notifies_cashier_and_fires_event(): void
    {
        $this->actingAsKitchen();
        Event::fake([OrderReady::class]);
        $order = KitchenOrder::factory()->preparing()->create();
        $cashierId = $order->transaction->cashier_id;

        $this->postJson("/api/kitchen-orders/{$order->id}/ready")
            ->assertOk()
            ->assertJsonPath('order.status', 'ready');

        Event::assertDispatched(OrderReady::class);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $cashierId,
            'type' => 'system',
        ]);
    }

    public function test_can_complete_order(): void
    {
        $this->actingAsKitchen();
        $order = KitchenOrder::factory()->ready()->create(['completed_at' => null]);

        $this->postJson("/api/kitchen-orders/{$order->id}/complete")
            ->assertOk()
            ->assertJsonPath('order.status', 'completed');

        $this->assertNotNull($order->fresh()->completed_at);
    }

    public function test_back_moves_status_one_step_backward(): void
    {
        $this->actingAsKitchen();
        $preparing = KitchenOrder::factory()->preparing()->create();
        $ready = KitchenOrder::factory()->ready()->create();

        $this->postJson("/api/kitchen-orders/{$preparing->id}/back")
            ->assertOk()
            ->assertJsonPath('order.status', 'pending');
        $this->assertNull($preparing->fresh()->prepared_at);

        $this->postJson("/api/kitchen-orders/{$ready->id}/back")
            ->assertOk()
            ->assertJsonPath('order.status', 'preparing');
    }

    public function test_store_update_destroy_routes_are_not_exposed(): void
    {
        $this->actingAsKitchen();

        // routes/api.php membatasi apiResource ->except(['store', 'update', 'destroy'])
        $this->postJson('/api/kitchen-orders', [])->assertStatus(405);
        $this->putJson('/api/kitchen-orders/1', [])->assertStatus(405);
        $this->deleteJson('/api/kitchen-orders/1')->assertStatus(405);
    }
}
