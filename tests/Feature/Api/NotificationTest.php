<?php

namespace Tests\Feature\Api;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private function actingAsOwner(): void
    {
        $this->user = $this->makeUser('owner');
        $this->apiAs($this->user);
    }

    public function test_guest_cannot_access_notifications(): void
    {
        $this->getJson('/api/notifications')->assertStatus(401);
    }

    public function test_index_only_returns_own_notifications_with_stats(): void
    {
        $this->actingAsOwner();
        $other = $this->makeUser('cashier');
        Notification::factory()->count(2)->create(['user_id' => $this->user->id, 'is_read' => false]);
        Notification::factory()->create(['user_id' => $other->id]);

        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonStructure([
                'notifications' => ['data'],
                'stats' => ['unread', 'urgent', 'new_reviews', 'failed_payment'],
            ])
            ->assertJsonCount(2, 'notifications.data')
            ->assertJsonPath('stats.unread', 2);
    }

    public function test_can_mark_single_notification_as_read(): void
    {
        $this->actingAsOwner();
        $notification = Notification::factory()->create(['user_id' => $this->user->id, 'is_read' => false]);

        $this->postJson("/api/notifications/{$notification->id}/read")
            ->assertOk()
            ->assertJsonPath('message', 'Notifikasi ditandai dibaca.');

        $notification->refresh();
        $this->assertTrue($notification->is_read);
        $this->assertNotNull($notification->read_at);
    }

    public function test_cannot_mark_other_users_notification(): void
    {
        $this->actingAsOwner();
        $other = $this->makeUser('cashier');
        $foreign = Notification::factory()->create(['user_id' => $other->id]);

        $this->postJson("/api/notifications/{$foreign->id}/read")->assertStatus(404);

        $this->assertFalse($foreign->fresh()->is_read);
    }

    public function test_can_read_all_own_notifications(): void
    {
        $this->actingAsOwner();
        $other = $this->makeUser('cashier');
        Notification::factory()->count(3)->create(['user_id' => $this->user->id, 'is_read' => false]);
        Notification::factory()->create(['user_id' => $other->id, 'is_read' => false]);

        $this->postJson('/api/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('message', 'Semua notifikasi ditandai dibaca.');

        $this->assertSame(0, Notification::where('user_id', $this->user->id)->where('is_read', false)->count());
        // notifikasi user lain tidak tersentuh
        $this->assertSame(1, Notification::where('user_id', $other->id)->where('is_read', false)->count());
    }

    public function test_can_delete_own_notification(): void
    {
        $this->actingAsOwner();
        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $this->deleteJson("/api/notifications/{$notification->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Notifikasi berhasil dihapus.');

        $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
    }

    public function test_cannot_delete_other_users_notification(): void
    {
        $this->actingAsOwner();
        $other = $this->makeUser('cashier');
        $foreign = Notification::factory()->create(['user_id' => $other->id]);

        $this->deleteJson("/api/notifications/{$foreign->id}")->assertStatus(404);
        $this->assertNotNull($foreign->fresh());
    }

    public function test_store_update_and_show_routes_are_not_exposed(): void
    {
        $this->actingAsOwner();

        // routes/api.php membatasi apiResource ->except(['store', 'show', 'update'])
        $this->postJson('/api/notifications', [])->assertStatus(405);
        $this->putJson('/api/notifications/1', [])->assertStatus(405);
        // GET jatuh ke fallback SPA GET (bukan 405) — pastikan route GET API tidak terdaftar.
        $this->assertApiRouteNotRegistered('GET', 'api/notifications/{notification}');
    }
}
