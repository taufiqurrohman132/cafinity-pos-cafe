<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    use AuthorizesRequests; // ← tambah ini

    public function index(Request $request): mixed
    {
        $query = User::with('roles')
            ->when(
                $request->search,
                fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('id', $request->search)
            )
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest();

        if ($request->export === 'csv') {
            $this->authorize('manage-users');
            $users = $query->get();
            $filename = 'users_' . now()->format('Ymd_His') . '.csv';
            $headers = [
                'Content-Type'        => 'text/csv',
                'Content-Disposition' => "attachment; filename={$filename}",
            ];
            $callback = function () use ($users) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['ID', 'Nama', 'Email', 'Role', 'Status', 'Bergabung']);
                foreach ($users as $user) {
                    fputcsv($file, [
                        $user->id,
                        $user->name,
                        $user->email,
                        ucfirst($user->role),
                        ucfirst($user->status),
                        $user->created_at->format('d/m/Y H:i'),
                    ]);
                }
                fclose($file);
            };
            return response()->stream($callback, 200, $headers);
        }

        $users = $query->paginate(20)->withQueryString();

        // stats
        $totalKasir   = User::where('role', 'cashier')->where('status', 'active')->count();
        $totalAdmin   = User::where('role', 'admin')->where('status', 'active')->count();
        $totalUser    = User::count();
        $totalActive  = User::where('status', 'active')->count();
        $totalPending = User::where('status', 'pending')->count();

        $logs = AuditLog::with('user')->latest()->take(4)->get()->map(fn($log) => [
            'id'         => $log->id,
            'user_name'  => $log->user?->name ?? 'System',
            'action'     => $log->action,
            'created_at' => $log->created_at->diffForHumans(),
        ]);

        return Inertia::render('UserManagement/Userdirectory/Index', [
            'users'        => $users,
            'stats' => [
                'totalKasir'   => $totalKasir,
                'totalAdmin'   => $totalAdmin,
                'totalUser'    => $totalUser,
                'totalActive'  => $totalActive,
                'totalPending' => $totalPending,
            ],
            'logs'         => $logs,
            'filters'      => $request->only(['search', 'role', 'status']),
            'can' => [
                'manage_users' => $request->user()->can('manage-users'),
            ],
        ]);
    }

    public function create()
    {
        return redirect()->route('users.index');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => ['required', Rule::in(['owner', 'admin', 'cashier'])],
            'status'   => ['nullable', Rule::in(['active', 'inactive', 'pending', 'deactivated'])],
        ]);

        $data['status']   = $data['status'] ?? 'active';
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        // Sync Spatie role
        $user->syncRoles([$data['role']]);

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => "Menambahkan pengguna baru: {$user->name}",
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function show(string $id)
    {
        return redirect()->route('users.index');
    }

    public function edit(string $id)
    {
        return redirect()->route('users.index');
    }
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role'   => ['required', Rule::in(['owner', 'admin', 'cashier'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'pending', 'deactivated'])],
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8|confirmed']);
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // Sync Spatie role
        $user->syncRoles([$data['role']]);

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => "Memperbarui profil pengguna: {$user->name}",
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $userName = $user->name;
        $user->delete();

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => "Menghapus pengguna: {$userName}",
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(string $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'password' => Hash::make('password123'),
        ]);

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => "Mereset password pengguna: {$user->name}",
        ]);

        return back()->with('success', 'Password direset ke: password123');
    }

    public function toggleStatus(string $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'status' => $user->status === 'active' ? 'inactive' : 'active',
        ]);

        $statusStr = $user->status === 'active' ? 'Mengaktifkan' : 'Menonaktifkan';

        // Audit Log
        AuditLog::create([
            'user_id' => Auth::id(),
            'action'  => "{$statusStr} pengguna: {$user->name}",
        ]);

        return back()->with('success', 'Status user diperbarui.');
    }
}
