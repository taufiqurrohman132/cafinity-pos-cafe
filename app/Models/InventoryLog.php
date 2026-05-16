<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_id', 'user_id', 'type',
        'qty_change', 'qty_before', 'qty_after',
        'notes', 'source',
    ];

    protected $casts = [
        'qty_change' => 'float',
        'qty_before' => 'float',
        'qty_after'  => 'float',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}