<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_id', 'user_id', 'type',
        'qty', 'stock_before', 'stock_after', 'notes',
    ];

    protected $casts = [
        'qty'          => 'float',
        'stock_before' => 'float',
        'stock_after'  => 'float',
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
