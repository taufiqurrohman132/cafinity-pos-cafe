<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('category')->nullable();
            $table->string('payment_term')->nullable();
            $table->unsignedInteger('lead_time')->default(0);
            $table->decimal('min_order', 15, 2)->default(0.00);
            $table->string('status')->default('active'); // active, inactive, blacklist
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->text('notes')->nullable();
            $table->string('code')->unique()->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
