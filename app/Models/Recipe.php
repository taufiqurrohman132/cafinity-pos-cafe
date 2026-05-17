<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id', 'notes',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function ingredients()
    {
        return $this->belongsToMany(Inventory::class, 'recipe_ingredients')
            ->using(RecipeIngredient::class)
            ->withPivot('qty', 'unit')
            ->withTimestamps();
    }

    public function getTotalHppAttribute(): int
    {
        return (int) $this->ingredients->sum(function ($item) {
            return $item->pivot->qty * $item->price_per_unit;
        });
    }

    public function getMarginAttribute(): float
    {
        $hpp = $this->total_hpp;
        $price = $this->menu?->price ?? 0;

        if ($price === 0) {
            return 0;
        }

        return round((($price - $hpp) / $price) * 100, 1);
    }
}
