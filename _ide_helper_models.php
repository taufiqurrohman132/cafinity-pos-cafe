<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuditLog query()
 */
	class AuditLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecipeIngredient> $recipeItems
 * @property-read int|null $recipe_items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ingredient newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ingredient newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ingredient query()
 */
	class Ingredient extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KitchenOrder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KitchenOrder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KitchenOrder query()
 */
	class KitchenOrder extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $category_id
 * @property string $nama
 * @property string|null $icon
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MenuItem> $menuItems
 * @property-read int|null $menu_items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuCategory whereUpdatedAt($value)
 */
	class MenuCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $menu_item_id
 * @property string $sku
 * @property string $nama
 * @property string $category_id
 * @property numeric $harga_jual
 * @property numeric $hpp
 * @property numeric $margin_pct
 * @property string $status
 * @property string|null $foto_url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property-read \App\Models\MenuCategory $category
 * @property-read \App\Models\Recipe|null $recipe
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereFotoUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereHargaJual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereHpp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereMarginPct($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereMenuItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereSku($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuItem whereStatus($value)
 */
	class MenuItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 */
	class Notification extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promotion query()
 */
	class Promotion extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PurchaseOrder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PurchaseOrder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PurchaseOrder query()
 */
	class PurchaseOrder extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $recipe_id
 * @property string $menu_item_id
 * @property numeric $total_hpp
 * @property string|null $last_sync
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecipeIngredient> $ingredients
 * @property-read int|null $ingredients_count
 * @property-read \App\Models\MenuItem $menu
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe whereLastSync($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe whereMenuItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Recipe whereTotalHpp($value)
 */
	class Recipe extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $recipe_id
 * @property string $ingredient_id
 * @property numeric $qty
 * @property string $satuan
 * @property numeric $subtotal_biaya
 * @property-read \App\Models\Ingredient|null $ingredient
 * @property-read \App\Models\Recipe $recipe
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereIngredientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereQty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereSatuan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecipeIngredient whereSubtotalBiaya($value)
 */
	class RecipeIngredient extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $cashier
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TransactionItem> $items
 * @property-read int|null $items_count
 * @property-read \App\Models\KitchenOrder|null $kitchenOrder
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 */
	class Transaction extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\MenuItem|null $menu
 * @property-read \App\Models\Transaction|null $transaction
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionItem query()
 */
	class TransactionItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string $status
 * @property string|null $shift_terakhir
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereShiftTerakhir($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

