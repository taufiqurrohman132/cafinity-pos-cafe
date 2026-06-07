<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'unread'       => Notification::where('user_id', auth()->id())->where('is_read', false)->count(),
            'urgent'       => Notification::where('user_id', auth()->id())->where('type', 'payment_failed')->where('is_read', false)->count(),
            'new_reviews'  => Notification::where('user_id', auth()->id())->where('type', 'review')->where('is_read', false)->count(),
            'failed_payment' => Notification::where('user_id', auth()->id())->where('type', 'payment_failed')->where('is_read', false)->count(),
        ];

        return response()->json([
            'notifications' => $notifications,
            'stats'         => $stats,
        ]);
    }

    public function readAll()
    {
        Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json([
            'message' => 'Semua notifikasi ditandai dibaca.',
        ]);
    }

    public function read(string $id)
    {
        $notification = Notification::where('user_id', auth()->id())->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notifikasi ditandai dibaca.',
            'notification' => $notification,
        ]);
    }

    public function destroy(string $id)
    {
        $notification = Notification::where('user_id', auth()->id())->findOrFail($id);
        $notification->delete();

        return response()->json([
            'message' => 'Notifikasi berhasil dihapus.',
        ]);
    }
}
