<?php

namespace Tests\Feature\Api;

use App\Events\LowStockTriggered;
use App\Events\OrderCreated;
use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Recipe;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;

    private function actingAsCashier(): void
    {
        $this->cashier = $this->makeUser('cashier');
        $this->apiAs($this->cashier);
    }

    public function test_guest_cannot_access_pos(): void
    {
        $this->getJson('/api/pos')->assertStatus(401);
        $this->postJson('/api/pos/checkout', [])->assertStatus(401);
    }

    public function test_pos_returns_categories_menus_and_promotions(): void
    {
        $this->actingAsCashier();
        Menu::factory()->create(['name' => 'Es Kopi', 'is_active' => true]);
        Menu::factory()->inactive()->create(['name' => 'Menu Nonaktif']);
        Transaction::factory()->held()->create(['cashier_id' => $this->cashier->id]);

        $this->getJson('/api/pos')
            ->assertOk()
            ->assertJsonStructure([
                'categories',
                'menus',
                'heldOrders',
                'initialCart',
                'resumedTransactionId',
                'taxPercent',
                'activePromotions',
                'cashierName',
                'urls',
            ])
            // hanya menu aktif yang tampil di POS
            ->assertJsonCount(1, 'menus')
            ->assertJsonPath('menus.0.name', 'Es Kopi')
            ->assertJsonCount(1, 'heldOrders')
            ->assertJsonPath('taxPercent', 10);
    }

    public function test_checkout_creates_transaction_items_and_kitchen_order(): void
    {
        $this->actingAsCashier();
        Event::fake([OrderCreated::class]);
        $menu = Menu::factory()->create(['price' => 20000]);

        $this->postJson('/api/pos/checkout', [
            'items' => [['menu_id' => $menu->id, 'qty' => 2]],
            'payment_method' => 'cash',
            'paid_amount' => 50000,
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('transaction.status', 'completed');

        $transaction = Transaction::first();
        $this->assertNotNull($transaction);
        $this->assertSame(40000, $transaction->total_amount);
        $this->assertSame(50000, $transaction->paid_amount);
        $this->assertSame(10000, $transaction->change_amount);

        $this->assertDatabaseHas('transaction_items', [
            'transaction_id' => $transaction->id,
            'menu_id' => $menu->id,
            'qty' => 2,
            'price' => 20000,
            'subtotal' => 40000,
        ]);

        $kitchenOrder = $transaction->kitchenOrder;
        $this->assertNotNull($kitchenOrder);
        $this->assertSame('pending', $kitchenOrder->status);
        $this->assertDatabaseHas('kitchen_order_items', [
            'kitchen_order_id' => $kitchenOrder->id,
            'menu_id' => $menu->id,
            'qty' => 2,
        ]);

        Event::assertDispatched(OrderCreated::class);
    }

    public function test_checkout_deducts_inventory_and_notifies_on_low_stock(): void
    {
        $this->actingAsCashier();
        $owner = $this->makeUser('owner');
        Event::fake([OrderCreated::class, LowStockTriggered::class]);

        $menu = Menu::factory()->create(['price' => 25000]);
        $inventory = Inventory::factory()->create(['stock' => 10, 'min_stock' => 5]);
        $recipe = Recipe::factory()->create(['menu_id' => $menu->id]);
        $recipe->ingredients()->attach($inventory->id, ['qty' => 3, 'unit' => 'gram']);

        // beli 2 => potong 6 => sisa 4 <= min 5 => stok menipis
        $this->postJson('/api/pos/checkout', [
            'items' => [['menu_id' => $menu->id, 'qty' => 2]],
        ])->assertOk();

        $this->assertDatabaseHas('inventories', ['id' => $inventory->id, 'stock' => 4]);
        $this->assertDatabaseHas('inventory_logs', [
            'inventory_id' => $inventory->id,
            'type' => 'out',
            'qty' => 6,
            'stock_before' => 10,
            'stock_after' => 4,
        ]);

        Event::assertDispatched(LowStockTriggered::class);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $owner->id,
            'type' => 'stock',
        ]);
    }

    public function test_checkout_cancels_the_held_transaction_it_resumes(): void
    {
        $this->actingAsCashier();
        $menu = Menu::factory()->create(['price' => 10000]);
        $held = Transaction::factory()->held()->create(['cashier_id' => $this->cashier->id]);

        $this->postJson('/api/pos/checkout', [
            'items' => [['menu_id' => $menu->id, 'qty' => 1]],
            'held_transaction_id' => $held->id,
        ])->assertOk();

        $this->assertDatabaseHas('transactions', ['id' => $held->id, 'status' => 'cancelled']);
    }

    public function test_checkout_validates_items(): void
    {
        $this->actingAsCashier();

        $this->postJson('/api/pos/checkout', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('items');

        $this->postJson('/api/pos/checkout', [
            'items' => [['menu_id' => 999999, 'qty' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors('items.0.menu_id');

        $this->postJson('/api/pos/checkout', [
            'items' => [['menu_id' => 1, 'qty' => 0]],
        ])->assertStatus(422)->assertJsonValidationErrors('items.0.qty');
    }

    public function test_hold_and_resume_transaction(): void
    {
        $this->actingAsCashier();
        $menu = Menu::factory()->create(['price' => 15000]);

        $this->postJson('/api/pos/hold', [
            'items' => [['menu_id' => $menu->id, 'qty' => 3]],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Transaksi di-hold.');

        $heldId = Transaction::where('status', 'held')->value('id');
        $this->assertNotNull($heldId);
        $this->assertDatabaseHas('transactions', ['id' => $heldId, 'total_amount' => 45000]);

        $this->postJson("/api/pos/resume/{$heldId}")
            ->assertOk()
            ->assertJsonPath('transaction.status', 'pending');

        $this->assertDatabaseHas('transactions', ['id' => $heldId, 'status' => 'pending']);
    }

    public function test_cancel_held_transaction(): void
    {
        $this->actingAsCashier();
        $held = Transaction::factory()->held()->create(['cashier_id' => $this->cashier->id]);

        $this->postJson("/api/pos/cancel/{$held->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('transactions', ['id' => $held->id, 'status' => 'cancelled']);
    }

    public function test_hold_requires_items(): void
    {
        $this->actingAsCashier();

        $this->postJson('/api/pos/hold', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('items');
    }

    public function test_index_returns_transactions_with_stats_and_filters(): void
    {
        $this->actingAsCashier();
        Transaction::factory()->create(['status' => 'completed', 'total_amount' => 50000, 'payment_method' => 'cash']);
        Transaction::factory()->create(['status' => 'refunded', 'total_amount' => 20000, 'payment_method' => 'qris']);

        $this->getJson('/api/transactions')
            ->assertOk()
            ->assertJsonStructure([
                'transactions' => ['data'],
                'filters',
                'stats' => ['total_revenue', 'total_transactions', 'avg_order', 'total_refund_cancel'],
            ])
            ->assertJsonCount(2, 'transactions.data');

        $this->getJson('/api/transactions?status=completed')
            ->assertOk()
            ->assertJsonCount(1, 'transactions.data');

        $this->getJson('/api/transactions?method=qris')
            ->assertOk()
            ->assertJsonCount(1, 'transactions.data');
    }

    public function test_can_show_transaction_detail(): void
    {
        $this->actingAsCashier();
        $transaction = Transaction::factory()->create();

        $this->getJson("/api/transactions/{$transaction->id}")
            ->assertOk()
            ->assertJsonStructure(['transaction' => ['id', 'items', 'cashier']]);
    }

    public function test_show_returns_404_for_missing_transaction(): void
    {
        $this->actingAsCashier();
        $this->getJson('/api/transactions/999999')->assertStatus(404);
    }

    public function test_invoice_and_print_endpoints(): void
    {
        $this->actingAsCashier();
        $transaction = Transaction::factory()->create();

        $this->getJson("/api/transactions/{$transaction->id}/invoice")
            ->assertOk()
            ->assertJsonStructure(['transaction' => ['id', 'items']]);

        $this->postJson("/api/transactions/{$transaction->id}/print")
            ->assertOk()
            ->assertJsonPath('status', 'printed');
    }

    public function test_can_refund_transaction_once(): void
    {
        $this->actingAsCashier();
        $transaction = Transaction::factory()->create(['status' => 'completed']);

        $this->postJson("/api/transactions/{$transaction->id}/refund")
            ->assertOk()
            ->assertJsonPath('transaction.status', 'refunded');

        $this->postJson("/api/transactions/{$transaction->id}/refund")
            ->assertStatus(400)
            ->assertJsonPath('message', 'Transaksi sudah di-refund.');
    }

    public function test_can_update_transaction_notes_and_status(): void
    {
        $this->actingAsCashier();
        $transaction = Transaction::factory()->create();

        $this->putJson("/api/transactions/{$transaction->id}", [
            'notes' => 'Catatan pelanggan',
            'status' => 'completed',
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'notes' => 'Catatan pelanggan',
            'status' => 'completed',
        ]);

        $this->putJson("/api/transactions/{$transaction->id}", ['status' => 'bogus'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_store_and_destroy_routes_are_not_exposed(): void
    {
        $this->actingAsCashier();

        // routes/api.php membatasi apiResource ->except(['store', 'destroy'])
        $this->postJson('/api/transactions', [])->assertStatus(405);
        $this->deleteJson('/api/transactions/1')->assertStatus(405);
    }

    public function test_export_returns_csv(): void
    {
        $this->actingAsCashier();
        Transaction::factory()->create(['total_amount' => 75000]);

        $response = $this->get('/api/transactions/export')->assertOk();

        $this->assertStringContainsString('ID Invoice', $response->streamedContent());
    }
}
