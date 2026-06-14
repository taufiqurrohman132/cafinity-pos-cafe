<?php

namespace App\Traits;

use App\Models\Scopes\TenantScope;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    /**
     * Boot the BelongsToTenant trait.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            if ($model instanceof Tenant) {
                return;
            }
            if (!$model->tenant_id) {
                $tenantId = auth()->check() ? auth()->user()->tenant_id : 1;
                
                if ($tenantId == 1) {
                    Tenant::firstOrCreate(
                        ['id' => 1],
                        ['name' => 'Default Cafe', 'slug' => 'default-cafe']
                    );
                }
                
                $model->tenant_id = $tenantId;
            }
        });
    }

    /**
     * Get the tenant that owns the model.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
