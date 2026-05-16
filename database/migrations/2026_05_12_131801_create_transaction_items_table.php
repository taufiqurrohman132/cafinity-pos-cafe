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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->string('item_id')->primary();

            $table->string('transaction_id');
            $table->foreign('transaction_id')
                ->references('transaction_id')
                ->on('transactions')
                ->cascadeOnDelete();

            $table->string('menu_item_id');
            $table->foreign('menu_item_id')
                ->references('menu_item_id')
                ->on('menu_items')
                ->cascadeOnDelete();

            $table->integer('qty');
            $table->decimal('harga_satuan', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->text('catatan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
