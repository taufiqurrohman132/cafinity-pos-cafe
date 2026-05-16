<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id', 'inventory_id', 'qty', 'unit', 'price_per_unit', 'subtotal',
    ];

    protected $casts = [
        'qty'            => 'float',
        'price_per_unit' => 'integer',
        'subtotal'       => 'integer',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}