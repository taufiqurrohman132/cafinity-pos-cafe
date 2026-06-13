<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateSystemNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $userId;
    public string $title;
    public string $body;
    public string $type;

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, string $title, string $body, string $type = 'system')
    {
        $this->userId = $userId;
        $this->title = $title;
        $this->body = $body;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Notification::create([
            'user_id' => $this->userId,
            'title'   => $this->title,
            'body'    => $this->body,
            'type'    => $this->type,
            'is_read' => false,
        ]);
    }
}
