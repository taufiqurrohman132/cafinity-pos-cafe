<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->enum('type', ['revenue', 'orders', 'profit']);
            $table->unsignedBigInteger('target_value');
            $table->unsignedBigInteger('current_value')->default(0);
            $table->string('period');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
