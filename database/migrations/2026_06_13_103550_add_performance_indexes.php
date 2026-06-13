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
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('inventories', function (Blueprint $table) {
            $table->index('stock');
            $table->index('min_stock');
        });

        Schema::table('kitchen_orders', function (Blueprint $table) {
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('inventories', function (Blueprint $table) {
            $table->dropIndex(['stock']);
            $table->dropIndex(['min_stock']);
        });

        Schema::table('kitchen_orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
