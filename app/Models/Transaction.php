<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function kitchenOrder()
    {
        return $this->hasOne(KitchenOrder::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'kasir_id');
    }
}
