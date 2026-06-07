<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockTriggered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $item;

    public function __construct($item)
    {
        $this->item = $item;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('cafinity-pos'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'stock.low';
    }
}
