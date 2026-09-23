<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan nilai 'waste' ke enum type inventory_logs.
     *
     * Controller penyesuaian stok (Api\InventoryController::adjust) menerima
     * type 'waste' dan frontend mengirimkannya, tetapi kolom enum tidak
     * memilikinya sehingga insert gagal (MySQL strict mode / CHECK sqlite).
     */
    public function up(): void
    {
        Schema::table('inventory_logs', function (Blueprint $table) {
            $table->enum('type', ['in', 'out', 'adjustment', 'restock', 'waste'])
                ->default('adjustment')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('inventory_logs', function (Blueprint $table) {
            $table->enum('type', ['in', 'out', 'adjustment', 'restock'])
                ->default('adjustment')
                ->change();
        });
    }
};
