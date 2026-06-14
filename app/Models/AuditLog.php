<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\BelongsToTenant;

class AuditLog extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id', 'user_id', 'action', 'target_type', 'target_id', 'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    protected $appends = ['created_at_human', 'event'];

    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at ? $this->created_at->diffForHumans() : '';
    }

    public function getEventAttribute(): string
    {
        return match($this->action) {
            'menu.created' => 'Menu dibuat',
            'menu.updated' => 'Detail menu diperbarui',
            'menu.deleted' => 'Menu dihapus',
            default => $this->action
        };
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $action, ?Model $target = null, ?array $metadata = null): self
    {
        dispatch(new \App\Jobs\LogAuditAction(
            $action,
            $target ? $target::class : null,
            $target?->getKey(),
            $metadata,
            auth()->id()
        ));

        return new static();
    }
}
