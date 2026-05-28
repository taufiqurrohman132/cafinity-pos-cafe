<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
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

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'stats'         => $stats,
        ]);
    }

    public function readAll()
    {
        Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return back()->with('success', 'Semua notifikasi ditandai dibaca.');
    }

    public function read(string $id)
    {
        $notification = Notification::where('user_id', auth()->id())->findOrFail($id);
        $notification->markAsRead();

        return back();
    }

    public function destroy(string $id)
    {
        Notification::where('user_id', auth()->id())->findOrFail($id)->delete();

        return back();
    }
}