<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    public function __construct($kitchenOrder)
    {
        $o = $kitchenOrder->loadMissing(['items.menu.category', 'transaction']);
        $this->order = [
            'id'             => $o->id,
            'transaction_id' => $o->transaction_id,
            'status'         => $o->status,
            'notes'          => $o->notes,
            'created_at'     => $o->created_at->toIso8601String(),
            'items'          => $o->items->map(fn($i) => [
                'qty'   => $i->qty,
                'notes' => $i->notes,
                'menu'  => [
                    'name'     => $i->menu?->name,
                    'category' => ['name' => $i->menu?->category?->name ?? ''],
                ],
            ])->toArray(),
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('cafinity-pos'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }
}
