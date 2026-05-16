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
        Schema::create('promotions', function (Blueprint $table) {
            $table->string('promo_id')->primary();
            $table->string('nama');

            $table->enum('type', ['diskon_persen', 'diskon_nominal', 'bundle']);

            $table->decimal('potongan', 12, 2)->default(0);

            $table->dateTime('periode_mulai');
            $table->dateTime('periode_selesai');

            $table->enum('status', ['active', 'inactive']);

            $table->integer('total_redemption')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
