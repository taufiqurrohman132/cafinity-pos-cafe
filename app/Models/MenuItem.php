<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    public function category()
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }

    public function recipe()
    {
        return $this->hasOne(Recipe::class, 'menu_item_id');
    }
}
