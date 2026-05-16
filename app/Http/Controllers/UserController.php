<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::paginate(20);
        return view('users.index', compact('users'));
    }

    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        User::create([...$request->validated(), 'password' => bcrypt($request->password)]);
        return redirect()->route('users.index')->with('success', 'User ditambahkan.');
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return view('users.show', compact('user'));
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('users.edit', compact('user'));
    }

    public function update(Request $request, $id)
    {
        User::findOrFail($id)->update($request->validated());
        return redirect()->route('users.index')->with('success', 'User diperbarui.');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->route('users.index')->with('success', 'User dihapus.');
    }

    public function resetPassword($id)
    {
        User::findOrFail($id)->update(['password' => bcrypt('password123')]);
        return back()->with('success', 'Password direset ke: password123');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        return back();
    }
}
