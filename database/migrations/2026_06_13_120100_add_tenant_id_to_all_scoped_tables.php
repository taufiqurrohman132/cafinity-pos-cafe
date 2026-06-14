<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users',
            'categories',
            'menus',
            'suppliers',
            'inventory_categories',
            'inventories',
            'inventory_logs',
            'recipes',
            'transactions',
            'promotions',
            'notifications',
            'purchase_orders',
            'bundles',
            'targets',
            'settings',
            'audit_logs',
            'kitchen_orders',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasColumn($table, 'tenant_id')) {
                Schema::table($table, function (Blueprint $tableGroup) {
                    $tableGroup->unsignedBigInteger('tenant_id')->nullable()->after('id')->index();
                    $tableGroup->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'users',
            'categories',
            'menus',
            'suppliers',
            'inventory_categories',
            'inventories',
            'inventory_logs',
            'recipes',
            'transactions',
            'promotions',
            'notifications',
            'purchase_orders',
            'bundles',
            'targets',
            'settings',
            'audit_logs',
            'kitchen_orders',
        ];

        foreach ($tables as $table) {
            if (Schema::hasColumn($table, 'tenant_id')) {
                Schema::table($table, function (Blueprint $tableGroup) {
                    $tableGroup->dropForeign(['tenant_id']);
                    $tableGroup->dropColumn('tenant_id');
                });
            }
        }
    }
};
