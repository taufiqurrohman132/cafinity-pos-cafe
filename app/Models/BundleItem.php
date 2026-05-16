<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BundleItem extends Pivot
{
    protected $table = 'bundle_items';

    protected $fillable = [
        'bundle_id', 'menu_id', 'qty',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];
}