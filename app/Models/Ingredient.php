<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    public function recipeItems()
    {
        return $this->hasMany(RecipeIngredient::class);
    }
}
