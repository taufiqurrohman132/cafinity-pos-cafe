<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id', 'action', 'target_type', 'target_id', 'metadata',
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
        return static::create([
            'user_id'     => auth()->id(),
            'action'      => $action,
            'target_type' => $target ? $target::class : null,
            'target_id'   => $target?->getKey(),
            'metadata'    => $metadata,
        ]);
    }
}
