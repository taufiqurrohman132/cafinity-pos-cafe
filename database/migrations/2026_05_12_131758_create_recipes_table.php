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
        Schema::create('recipes', function (Blueprint $table) {
            $table->string('recipe_id')->primary();

            $table->string('menu_item_id');
            $table->foreign('menu_item_id')
                ->references('menu_item_id')
                ->on('menu_items')
                ->cascadeOnDelete();

            $table->decimal('total_hpp', 12, 2)->default(0);
            $table->dateTime('last_sync')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
