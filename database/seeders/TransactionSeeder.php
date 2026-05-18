<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::where('role', 'cashier')->first();

        $transactions = [
            [
                'status'         => 'completed',
                'payment_method' => 'QRIS',
                'notes'          => null,
                'items' => [
                    ['menu' => 'Nasi Goreng Spesial Java', 'qty' => 2],
                    ['menu' => 'Matcha Latte Ice',          'qty' => 1],
                    ['menu' => 'Croissant Almond Butter',   'qty' => 1],
                    ['menu' => 'Es Kopi Susu Gula Aren',    'qty' => 1],
                ],
            ],
            [
                'status'         => 'completed',
                'payment_method' => 'Cash',
                'notes'          => null,
                'items' => [
                    ['menu' => 'Caffe Latte Hot',    'qty' => 2],
                    ['menu' => 'Croissant Butter',   'qty' => 2],
                ],
            ],
            [
                'status'         => 'pending',
                'payment_method' => null,
                'notes'          => 'Pelanggan meminta dipisah antara bon makanan dan minuman.',
                'items' => [
                    ['menu' => 'Beef Burger Combo',        'qty' => 1],
                    ['menu' => 'Ice Lemon Tea',             'qty' => 1],
                    ['menu' => 'French Fries',              'qty' => 1],
                ],
            ],
            [
                'status'         => 'completed',
                'payment_method' => 'EDC',
                'notes'          => null,
                'items' => [
                    ['menu' => 'Spaghetti Carbonara',  'qty' => 1],
                    ['menu' => 'Avocado Juice',         'qty' => 2],
                ],
            ],
            [
                'status'         => 'completed',
                'payment_method' => 'QRIS',
                'notes'          => null,
                'items' => [
                    ['menu' => 'Es Kopi Susu Gula Aren', 'qty' => 3],
                    ['menu' => 'Croissant Almond Butter', 'qty' => 2],
                ],
            ],
        ];

        foreach ($transactions as $trx) {
            $total = 0;
            $itemsData = [];

            foreach ($trx['items'] as $item) {
                $menu     = Menu::where('name', $item['menu'])->first();
                if (!$menu) continue;
                $subtotal = $menu->price * $item['qty'];
                $total   += $subtotal;
                $itemsData[] = [
                    'menu_id'  => $menu->id,
                    'qty'      => $item['qty'],
                    'price'    => $menu->price,
                    'discount' => 0,
                    'subtotal' => $subtotal,
                ];
            }

            $tax  = (int)($total * 0.1);
            $paid = $total + $tax;

            $transaction = Transaction::create([
                'cashier_id' => $cashier->id,
                'status'         => $trx['status'],
                'total_amount'   => $total,
                'discount'       => 0,
                'tax'            => $tax,
                'payment_method' => $trx['payment_method'],
                'paid_amount'    => $paid,
                'change_amount'  => 0,
                'notes'          => $trx['notes'],
            ]);

            foreach ($itemsData as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    ...$item,
                ]);
            }
        }
    }
}
