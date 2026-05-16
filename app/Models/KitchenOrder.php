<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'status', 'notes', 'prepared_at', 'completed_at',
    ];

    protected $casts = [
        'prepared_at'  => 'datetime',
        'completed_at' => 'datetime',
    ];

    // status: pending, preparing, ready, completed

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function items()
    {
        return $this->hasMany(KitchenOrderItem::class);
    }
}