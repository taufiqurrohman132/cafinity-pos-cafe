<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\KitchenOrder;
use App\Models\KitchenOrderItem;
use App\Models\TransactionItem;
use Illuminate\Database\Seeder;

class KitchenOrderSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['preparing', 'pending', 'pending', 'ready', 'completed'];

        Transaction::all()->each(function ($trx, $i) use ($statuses) {
            $order = KitchenOrder::create([
                'transaction_id' => $trx->id,
                'status'         => $statuses[$i] ?? 'pending',
                'prepared_at'    => in_array($statuses[$i] ?? '', ['ready','completed']) ? now() : null,
                'completed_at'   => ($statuses[$i] ?? '') === 'completed' ? now() : null,
            ]);

            foreach ($trx->items as $item) {
                KitchenOrderItem::create([
                    'kitchen_order_id' => $order->id,
                    'menu_id'          => $item->menu_id,
                    'qty'              => $item->qty,
                    'notes'            => $item->notes,
                ]);
            }
        });
    }
}