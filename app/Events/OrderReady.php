<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderReady implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    public function __construct($kitchenOrder)
    {
        $kitchenOrder->loadMissing('transaction.cashier');
        $this->order = [
            'id'             => $kitchenOrder->id,
            'transaction_id' => $kitchenOrder->transaction_id,
            'status'         => $kitchenOrder->status,
            'cashier_id'     => $kitchenOrder->transaction?->cashier_id,
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
        return 'order.ready';
    }
}
