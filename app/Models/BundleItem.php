<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BundleItem extends Pivot
{
    protected $table = 'bundle_items';

    public $incrementing = true;

    protected $fillable = [
        'bundle_id', 'menu_id', 'qty',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];

    public function bundle(): BelongsTo
    {
        return $this->belongsTo(Bundle::class);
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
