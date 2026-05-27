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
    protected $appends = ['image_url'];
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
}
