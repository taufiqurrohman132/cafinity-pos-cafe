<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'unit', 'stock', 'min_stock',
        'price_per_unit', 'supplier_id', 'inventory_category_id',
    ];

    protected $casts = [
        'stock'          => 'float',
        'min_stock'      => 'float',
        'price_per_unit' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(InventoryCategory::class, 'inventory_category_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'recipe_ingredients')
            ->using(RecipeIngredient::class)
            ->withPivot('qty', 'unit')
            ->withTimestamps();
    }

    public function purchaseOrderItems()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function logs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock <= $this->min_stock;
    }

    public function adjustStock(float $qty, string $type, ?string $notes = null): void
    {
        $before = $this->stock;
        $this->stock += $qty;
        $this->save();

        $this->logs()->create([
            'user_id'      => auth()->id(),
            'type'         => $type,
            'qty'          => abs($qty),
            'stock_before' => $before,
            'stock_after'  => $this->stock,
            'notes'        => $notes,
        ]);
    }
}
