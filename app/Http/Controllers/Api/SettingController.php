<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private function getSettings()
    {
        $settings = Setting::all()->keyBy('key')->map(fn($item) => $item->value);

        // Standard default settings if empty to match Visly mockup
        $defaults = [
            'cafe_name' => 'SmartCafe Sudirman',
            'cafe_category' => 'Cafe & Restaurant',
            'cafe_address' => 'Jl. Jendral Sudirman No. 12, Senayan, Jakarta Selatan',
            'cafe_phone' => '+62 21 555 0123',
            'cafe_email' => 'contact@smartcafe.id',
            'tax_rate' => '12',
            'service_charge' => '5',
            'tax_inclusive' => '1',
            'currency' => 'IDR (Indonesian Rupiah)',
            'timezone' => '(GMT+07:00) Asia/Jakarta',
            'language' => 'Bahasa Indonesia (ID)',
            'operational_hours' => json_encode([
                'Senin' => ['active' => true, 'open' => '08:00', 'close' => '22:00'],
                'Selasa' => ['active' => true, 'open' => '09:00', 'close' => '23:00'],
                'Rabu' => ['active' => true, 'open' => '08:00', 'close' => '23:00'],
                'Kamis' => ['active' => true, 'open' => '09:00', 'close' => '23:00'],
                'Jumat' => ['active' => true, 'open' => '09:00', 'close' => '23:00'],
                'Sabtu' => ['active' => true, 'open' => '09:00', 'close' => '23:00'],
                'Minggu' => ['active' => false, 'open' => '09:00', 'close' => '18:00']
            ])
        ];

        foreach ($defaults as $key => $val) {
            if (!isset($settings[$key])) {
                $settings[$key] = $val;
            }
        }

        return $settings;
    }

    public function index()
    {
        return response()->json([
            'settings' => $this->getSettings()
        ]);
    }

    public function general(Request $request)
    {
        $data = $request->validate([
            'cafe_name' => 'nullable|string|max:255',
            'cafe_category' => 'nullable|string|max:255',
            'cafe_address' => 'nullable|string',
            'cafe_phone' => 'nullable|string|max:50',
            'cafe_email' => 'nullable|email|max:255',
            'tax_rate' => 'nullable|numeric|min:0',
            'service_charge' => 'nullable|numeric|min:0',
            'tax_inclusive' => 'nullable|string',
            'currency' => 'nullable|string|max:100',
            'timezone' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:100',
            'operational_hours' => 'nullable|array',
        ]);

        foreach ($data as $key => $value) {
            if ($key === 'operational_hours') {
                $value = json_encode($value);
            }
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'group' => 'general']
            );
        }

        return response()->json([
            'message' => 'Pengaturan bisnis berhasil disimpan.',
            'settings' => $this->getSettings(),
        ]);
    }

    public function security(Request $request)
    {
        $data = $request->validate([
            'session_timeout' => 'nullable|integer|min:5',
            'require_2fa' => 'nullable|boolean',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : $value, 'group' => 'security']
            );
        }

        return response()->json([
            'message' => 'Pengaturan keamanan disimpan.',
            'settings' => $this->getSettings(),
        ]);
    }

    public function appearance(Request $request)
    {
        $data = $request->validate([
            'theme' => 'nullable|in:light,dark',
            'accent_color' => 'nullable|string|max:20',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'group' => 'appearance']
            );
        }

        return response()->json([
            'message' => 'Pengaturan tampilan disimpan.',
            'settings' => $this->getSettings(),
        ]);
    }
}
