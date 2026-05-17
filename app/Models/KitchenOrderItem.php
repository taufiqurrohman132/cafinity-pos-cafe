<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'kitchen_order_id', 'menu_id', 'qty', 'notes',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];

    public function kitchenOrder()
    {
        return $this->belongsTo(KitchenOrder::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
