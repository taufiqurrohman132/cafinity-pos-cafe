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
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();

            $table->string('recipe_id');
            $table->foreign('recipe_id')
                ->references('recipe_id')
                ->on('recipes')
                ->cascadeOnDelete();

            $table->string('ingredient_id');
            $table->foreign('ingredient_id')
                ->references('ingredient_id')
                ->on('ingredients')
                ->cascadeOnDelete();

            $table->decimal('qty', 12, 2);
            $table->string('satuan');
            $table->decimal('subtotal_biaya', 12, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
