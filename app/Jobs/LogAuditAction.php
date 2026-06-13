<?php

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogAuditAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $action;
    public ?string $targetType;
    public $targetId;
    public ?array $metadata;
    public ?int $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $action, ?string $targetType = null, $targetId = null, ?array $metadata = null, ?int $userId = null)
    {
        $this->action = $action;
        $this->targetType = $targetType;
        $this->targetId = $targetId;
        $this->metadata = $metadata;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        AuditLog::create([
            'user_id'     => $this->userId,
            'action'      => $this->action,
            'target_type' => $this->targetType,
            'target_id'   => $this->targetId,
            'metadata'    => $this->metadata,
        ]);
    }
}
