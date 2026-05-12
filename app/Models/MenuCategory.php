<?php

namespace App\Models;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Model;

class MenuCategory extends Model
{
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }
}
