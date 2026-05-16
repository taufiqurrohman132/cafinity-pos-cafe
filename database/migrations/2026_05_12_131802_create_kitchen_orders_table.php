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
        Schema::create('kitchen_orders', function (Blueprint $table) {
            $table->string('kitchen_order_id')->primary();

            $table->string('transaction_id');
            $table->foreign('transaction_id')
                ->references('transaction_id')
                ->on('transactions')
                ->cascadeOnDelete();

            $table->enum('order_type', ['dine_in', 'takeaway']);
            $table->string('meja')->nullable();
            $table->enum('status', ['waiting', 'processing', 'done']);

            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kitchen_orders');
    }
};
