<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'notes',
        'total_hpp', // ← tambahkan ini
    ];

    protected $appends = [
        'margin',
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

    // Hapus accessor getTotalHppAttribute() yang lama
    // Ganti dengan method recalculate yang dipanggil saat data berubah

    public function recalculateHpp(): void
    {
        $hpp = (int) $this->ingredients->sum(function ($item) {
            return $item->pivot->qty * $item->price_per_unit;
        });

        // Hapus baris dump ini kalau masih ada
        // dump("ID: {$this->id}, HPP: {$hpp}");

        \Illuminate\Support\Facades\DB::update(
            "UPDATE recipes SET total_hpp = {$hpp} WHERE id = {$this->id}"
        );

        $this->total_hpp = $hpp;
    }
    
    // getMarginAttribute tetap sama, total_hpp sekarang dari kolom DB
    public function getMarginAttribute(): float
    {
        if ($this->relationLoaded('menu')) {
            $price = $this->menu?->price ?? 0;
        } else {
            $price = $this->menu()->value('price') ?? 0;
        }

        if ($price === 0) return 0;

        return round((($price - $this->total_hpp) / $price) * 100, 1);
    }
}
