<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cashier_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'held', 'completed', 'cancelled', 'refunded'])->default('pending');
            $table->unsignedInteger('total_amount')->default(0);
            $table->unsignedInteger('discount')->default(0);
            $table->unsignedInteger('tax')->default(0);
            $table->string('payment_method')->nullable();
            $table->unsignedInteger('paid_amount')->default(0);
            $table->unsignedInteger('change_amount')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
