<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Created after inventories in 2026_05_16_024657_create_recipe_ingredients_table.php
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
