<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // $semuaMenu = MenuItem::all(); // 1. Ambil data dari database
        // return view('menus.index', compact('semuaMenu')); // 2. Kirim data ke tampilan (blade)
        return view('shared.menu-management.index'); // 2. Kirim data ke tampilan (blade)
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
            // 1. Validasi inputan user
        $request->validate(['nama_menu' => 'required', 'harga' => 'required']);

        // 2. Simpan ke database
        MenuItem::create($request->all());

        // 3. Pindahkan halaman kembali ke daftar menu
        return redirect()->route('menus.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    
    }
}
