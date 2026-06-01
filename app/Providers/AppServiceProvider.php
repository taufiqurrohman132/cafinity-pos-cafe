<?php

namespace App\Providers;

use App\Models\Recipe;
use App\Observers\RecipeObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Recipe::observe(RecipeObserver::class); // ← tambahkan ini

        // Dynamic Gate Fallbacks mapping general permissions to granular module permissions
        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            if ($user->hasRole('owner')) {
                return true; // Super-admin wildcard bypass for owner
            }
        });

        \Illuminate\Support\Facades\Gate::define('manage-users', function ($user) {
            return $user->hasAnyPermission(['users.view', 'users.create', 'users.edit', 'users.delete', 'users.export']);
        });

        \Illuminate\Support\Facades\Gate::define('manage-menu', function ($user) {
            return $user->hasAnyPermission([
                'menus.view', 'menus.create', 'menus.edit', 'menus.delete', 'menus.export',
                'recipe-costing.view', 'recipe-costing.create', 'recipe-costing.edit', 'recipe-costing.delete', 'recipe-costing.export',
                'inventories.view', 'inventories.create', 'inventories.edit', 'inventories.delete', 'inventories.export'
            ]);
        });

        \Illuminate\Support\Facades\Gate::define('manage-orders', function ($user) {
            return $user->hasAnyPermission([
                'pos.view', 'pos.create', 'pos.edit', 'pos.delete', 'pos.export',
                'transactions.view', 'transactions.create', 'transactions.edit', 'transactions.delete', 'transactions.export'
            ]);
        });

        \Illuminate\Support\Facades\Gate::define('view-reports', function ($user) {
            return $user->hasAnyPermission(['reports.view', 'reports.create', 'reports.edit', 'reports.delete', 'reports.export']);
        });

        \Illuminate\Support\Facades\Gate::define('manage-settings', function ($user) {
            return $user->hasAnyPermission([
                'users.view', 'users.create', 'users.edit', 'users.delete', 'users.export'
            ]) || $user->hasRole('admin');
        });

        // Auto-reset database daily for demo purposes in local environment
        if ($this->app->environment('local')) {
            $resetFile = storage_path('app/last_reset_date.txt');
            $today = date('Y-m-d');
            if (!file_exists($resetFile)) {
                @file_put_contents($resetFile, $today);
            } elseif (trim(@file_get_contents($resetFile)) !== $today) {
                @file_put_contents($resetFile, $today);
                try {
                    \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--seed' => true]);
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::error('DB Auto-Reset Failed: ' . $e->getMessage());
                }
            }
        }
    }
}
