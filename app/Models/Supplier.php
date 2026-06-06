<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'city',
        'province',
        'category',
        'payment_term',
        'lead_time',
        'min_order',
        'status',
        'rating',
        'notes',
        'code',
        'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'lead_time'  => 'integer',
        'min_order'  => 'decimal:2',
        'rating'     => 'decimal:2',
    ];

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function contacts()
    {
        return $this->hasMany(SupplierContact::class);
    }

    public function documents()
    {
        return $this->hasMany(SupplierDocument::class);
    }
}