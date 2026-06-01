<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of roles with their permissions.
     */
    public function index(Request $request): Response
    {
        // Ambil data roles beserta permissions-nya
        $roles = Role::with('permissions')
            ->withCount('users')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->get();

        $logs = \App\Models\AuditLog::with('user')
            ->where('action', 'like', '%peran%')
            ->orWhere('action', 'like', '%role%')
            ->orWhere('action', 'like', '%akses%')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($log) => [
                'id'         => $log->id,
                'user_name'  => $log->user?->name ?? 'System',
                'action'     => $log->action,
                'created_at' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('UserManagement/RolePermission/Index', [
            'roles' => $roles,
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:100', 'unique:roles,name'],
            'description'  => ['nullable', 'string', 'max:255'],
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => 'web',
                'description' => $validated['description'] ?? null
            ]);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            // Audit Log
            \App\Models\AuditLog::create([
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'action'  => "Membuat peran baru: {$role->name}",
            ]);

            DB::commit();

            return back()->with('success', "Role {$role->name} berhasil dibuat.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified role name and description.
     */
    public function update(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:100', Rule::unique('roles', 'name')->ignore($id)],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        DB::beginTransaction();
        try {
            $role->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null
            ]);

            // Audit Log
            \App\Models\AuditLog::create([
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'action'  => "Memperbarui info peran: {$role->name}",
            ]);

            DB::commit();

            return back()->with('success', 'Role berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(int $id)
    {
        $role = Role::findOrFail($id);

        if (in_array($role->name, ['owner', 'admin', 'cashier'])) {
            return back()->with('error', 'Role bawaan sistem diproteksi dan tidak dapat dihapus.');
        }

        $roleName = $role->name;

        DB::beginTransaction();
        try {
            $role->syncPermissions([]);
            $role->delete();

            // Audit Log
            \App\Models\AuditLog::create([
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'action'  => "Menghapus peran: {$roleName}",
            ]);

            DB::commit();

            return back()->with('success', 'Role berhasil dihapus.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update permissions for the specified role.
     */
    public function updatePermissions(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions'   => ['present', 'array'], // present agar bisa mengosongkan permission
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role->syncPermissions($validated['permissions']);

            // Audit Log
            \App\Models\AuditLog::create([
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'action'  => "Memperbarui hak akses peran: {$role->name}",
            ]);

            DB::commit();

            return back()->with('success', 'Hak akses role berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }
}
