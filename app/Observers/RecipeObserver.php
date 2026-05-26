<?php

namespace App\Observers;

use App\Models\Recipe;

class RecipeObserver
{
    public function saved(Recipe $recipe): void
    {
        $recipe->load('ingredients');
        $recipe->recalculateHpp();
    }
}