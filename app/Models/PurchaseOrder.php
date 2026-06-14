<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class PurchaseOrder extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'supplier_id',
        'user_id',
        'po_number',
        'delivery_date',
        'delivery_location',
        'reference_number',
        'status',
        'total_amount',
        'notes',
        'created_by',
        'approved_at',
        'ordered_at',
        'received_at',
    ];

    protected $casts = [
        'total_amount'  => 'integer',
        'delivery_date' => 'date',
        'approved_at'   => 'datetime',
        'ordered_at'    => 'datetime',
        'received_at'   => 'datetime',
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

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function approvals()
    {
        return $this->hasMany(PoApproval::class);
    }
}