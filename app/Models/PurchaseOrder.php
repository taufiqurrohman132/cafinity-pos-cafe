<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id', 'user_id', 'status',
        'total_amount', 'notes', 'ordered_at', 'received_at',
    ];

    protected $casts = [
        'total_amount' => 'integer',
        'ordered_at'   => 'datetime',
        'received_at'  => 'datetime',
    ];

    // status: pending, approved, rejected, received

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}