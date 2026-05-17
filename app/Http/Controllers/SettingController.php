<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SettingController extends Controller
{
    public function index(): View
    {
        $settings = Setting::all()->keyBy('key');

        return view('shared.settings.index', compact('settings'));
    }

    public function general(Request $request)
    {
        $data = $request->validate([
            'store_name'    => 'nullable|string|max:255',
            'store_address' => 'nullable|string',
            'store_phone'   => 'nullable|string|max:50',
            'currency'      => 'nullable|string|max:10',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => 'general']
            );
        }

        return back()->with('success', 'Pengaturan umum disimpan.');
    }

    public function security(Request $request)
    {
        $data = $request->validate([
            'session_timeout' => 'nullable|integer|min:5',
            'require_2fa'     => 'nullable|boolean',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : $value, 'group' => 'security']
            );
        }

        return back()->with('success', 'Pengaturan keamanan disimpan.');
    }

    public function appearance(Request $request)
    {
        $data = $request->validate([
            'theme'       => 'nullable|in:light,dark',
            'accent_color'=> 'nullable|string|max:20',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => 'appearance']
            );
        }

        return back()->with('success', 'Pengaturan tampilan disimpan.');
    }
}
