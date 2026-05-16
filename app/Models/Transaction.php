<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'cashier_id', 'status', 'total_amount',
        'discount', 'tax', 'payment_method',
        'paid_amount', 'change_amount', 'notes',
    ];

    protected $casts = [
        'total_amount'  => 'integer',
        'discount'      => 'integer',
        'tax'           => 'integer',
        'paid_amount'   => 'integer',
        'change_amount' => 'integer',
    ];

    // status: pending, held, completed, cancelled, refunded

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function kitchenOrder()
    {
        return $this->hasOne(KitchenOrder::class);
    }
}