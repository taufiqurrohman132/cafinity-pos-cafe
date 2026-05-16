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
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('transaction_id')->primary();
            $table->string('invoice_no')->unique();

            $table->string('kasir_id');
            $table->foreign('kasir_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            $table->string('customer_name')->nullable();
            $table->enum('order_type', ['dine_in', 'takeaway']);
            $table->enum('payment_method', ['cash', 'qris', 'transfer', 'debit']);

            $table->decimal('subtotal', 12, 2);
            $table->decimal('pajak', 12, 2)->default(0);
            $table->decimal('service_charge', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            $table->enum('status', ['pending', 'paid', 'cancelled']);
            $table->text('catatan_internal')->nullable();

            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
