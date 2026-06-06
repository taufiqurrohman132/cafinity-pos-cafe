<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoApproval extends Model
{
    use HasFactory;

    protected $table = 'po_approvals';

    protected $fillable = [
        'purchase_order_id',
        'approver_id',
        'status',
        'notes',
        'level',
        'acted_at',
    ];

    protected $casts = [
        'level'    => 'integer',
        'acted_at' => 'datetime',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
