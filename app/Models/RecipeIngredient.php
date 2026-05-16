<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeIngredient extends Pivot
{
    protected $table = 'recipe_ingredients';

    protected $fillable = [
        'recipe_id', 'inventory_id', 'qty', 'unit',
    ];

    protected $casts = [
        'qty' => 'float',
    ];
}