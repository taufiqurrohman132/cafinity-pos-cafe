<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key');
        return view('settings.index', compact('settings'));
    }

    public function general(Request $request)
    {
        foreach ($request->validated() as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return back()->with('success', 'Pengaturan umum disimpan.');
    }

    public function security(Request $request)
    {
        foreach ($request->validated() as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return back()->with('success', 'Pengaturan keamanan disimpan.');
    }

    public function appearance(Request $request)
    {
        foreach ($request->validated() as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return back()->with('success', 'Pengaturan tampilan disimpan.');
    }
}
