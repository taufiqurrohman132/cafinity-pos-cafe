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
