<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'cafe_name',       'value' => 'Smart Cafe POS',              'group' => 'general'],
            ['key' => 'cafe_address',    'value' => 'Jl. Menteng Raya No. 42, Jakarta Pusat', 'group' => 'general'],
            ['key' => 'cafe_phone',      'value' => '(021) 555-0123',              'group' => 'general'],
            ['key' => 'tax_rate',        'value' => '10',                           'group' => 'finance'],
            ['key' => 'service_charge',  'value' => '5',                            'group' => 'finance'],
            ['key' => 'currency',        'value' => 'IDR',                          'group' => 'finance'],
            ['key' => 'open_time',       'value' => '08:00',                        'group' => 'operational'],
            ['key' => 'close_time',      'value' => '22:00',                        'group' => 'operational'],
            ['key' => 'receipt_footer',  'value' => 'Terima kasih atas kunjungan Anda!', 'group' => 'receipt'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}