<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'menu_id', 'qty',
        'price', 'discount', 'subtotal', 'notes',
    ];

    protected $casts = [
        'qty'      => 'integer',
        'price'    => 'integer',
        'discount' => 'integer',
        'subtotal' => 'integer',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}