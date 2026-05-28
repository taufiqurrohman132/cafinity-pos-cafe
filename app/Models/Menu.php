<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price'     => 'integer',
        'is_active' => 'boolean',
    ];

    // Menu.php
    protected $appends = ['image_url', 'active_bundle', 'hpp', 'profit_trend', 'is_best_seller'];
    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function recipe()
    {
        return $this->hasOne(Recipe::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function bundles()
    {
        return $this->belongsToMany(Bundle::class, 'bundle_items');
    }

    public function activeBundle()
    {
        return $this->belongsToMany(Bundle::class, 'bundle_items')
            ->where('is_active', true);
    }

    public function getActiveBundleAttribute()
    {
        if ($this->relationLoaded('activeBundle')) {
            return $this->getRelation('activeBundle')->first();
        }

        return $this->activeBundle()->first();
    }

    public function getHppAttribute()
    {
        if ($this->relationLoaded('recipe')) {
            return $this->recipe?->total_hpp ?? 0;
        }

        return $this->recipe()->value('total_hpp') ?? 0;
    }

    public function getProfitTrendAttribute()
    {
        return null;
    }

    public function getIsBestSellerAttribute(): bool
    {
        return false;
    }
}
