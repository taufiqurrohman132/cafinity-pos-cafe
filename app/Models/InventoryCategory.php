<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class InventoryCategory extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = ['tenant_id', 'name'];

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'inventory_category_id');
    }
}