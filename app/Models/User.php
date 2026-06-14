<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; // ← tambah ini
use App\Traits\BelongsToTenant;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens, BelongsToTenant; // ← tambah HasRoles di sini

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'role',
        'status',
        'shift_terakhir',
        'two_fa_enabled',
        'two_fa_method',
        'two_fa_secret',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['created_at_diff'];

    public function getCreatedAtDiffAttribute()
    {
        return $this->created_at ? $this->created_at->diffForHumans() : null;
    }

    public function toArray()
    {
        $attributes = parent::toArray();
        $attributes['permissions'] = method_exists($this, 'getAllPermissions')
            ? $this->getAllPermissions()->pluck('name')->toArray()
            : [];
        return $attributes;
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'shift_terakhir'    => 'datetime',
            'two_fa_enabled'    => 'boolean',
            'last_login'        => 'datetime',
        ];
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'cashier_id');
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function createdPurchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class, 'created_by');
    }

    public function appNotifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function userSessions()
    {
        return $this->hasMany(UserSession::class);
    }

    public function uploadedSupplierDocuments()
    {
        return $this->hasMany(SupplierDocument::class, 'uploaded_by');
    }

    public function poApprovals()
    {
        return $this->hasMany(PoApproval::class, 'approver_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'owner'   => 'owner.dashboard',
            'admin'   => 'admin.dashboard',
            default   => 'cashier.dashboard',
        };
    }
}
