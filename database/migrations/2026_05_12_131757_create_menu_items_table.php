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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->string('menu_item_id')->primary();
            $table->string('sku')->unique();
            $table->string('nama');

            $table->string('category_id');
            $table->foreign('category_id')
                ->references('category_id')
                ->on('menu_categories')
                ->cascadeOnDelete();

            $table->decimal('harga_jual', 12, 2);
            $table->decimal('hpp', 12, 2)->default(0);
            $table->decimal('margin_pct', 5, 2)->default(0);

            $table->enum('status', ['active', 'inactive']);
            $table->string('foto_url')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
