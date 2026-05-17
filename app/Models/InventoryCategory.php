<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'inventory_category_id');
    }
}