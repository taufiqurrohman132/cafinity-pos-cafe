<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bundle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'is_active',
    ];

    protected $casts = [
        'price'     => 'integer',
        'is_active' => 'boolean',
    ];

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'bundle_items')
                    ->withPivot('qty')
                    ->withTimestamps();
    }
}