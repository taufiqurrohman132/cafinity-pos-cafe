<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        $users = User::latest()->paginate(20);

        return view('shared.user-management.index', compact('users'));
    }

    public function create(): View
    {
        return view('shared.user-management.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => ['required', Rule::in(['owner', 'admin', 'cashier'])],
            'status'   => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $data['status'] = $data['status'] ?? 'active';

        User::create($data);

        return redirect()->route('users.index')->with('success', 'User ditambahkan.');
    }

    public function show(string $id): View
    {
        $user = User::findOrFail($id);

        return view('shared.user-management.show', compact('user'));
    }

    public function edit(string $id): View
    {
        $user = User::findOrFail($id);

        return view('shared.user-management.edit', compact('user'));
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role'   => ['required', Rule::in(['owner', 'admin', 'cashier'])],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8|confirmed']);
            $data['password'] = $request->password;
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'User diperbarui.');
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User dihapus.');
    }

    public function resetPassword(string $id)
    {
        User::findOrFail($id)->update(['password' => 'password123']);

        return back()->with('success', 'Password direset ke: password123');
    }

    public function toggleStatus(string $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'status' => $user->status === 'active' ? 'inactive' : 'active',
        ]);

        return back();
    }
}
