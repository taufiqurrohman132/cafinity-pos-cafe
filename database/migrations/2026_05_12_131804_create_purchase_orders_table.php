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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->string('po_id')->primary();

            $table->string('ingredient_id');
            $table->foreign('ingredient_id')
                ->references('ingredient_id')
                ->on('ingredients')
                ->cascadeOnDelete();

            $table->string('user_id');
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            $table->decimal('qty_pesan', 12, 2);
            $table->string('satuan');

            $table->enum('status', ['pending', 'approved', 'received', 'cancelled']);

            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
