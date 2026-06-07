<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class RolePermissionController extends Controller
{
    public function index(Request $request)
    {
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

        return response()->json([
            'roles' => $roles,
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }

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

            \App\Models\AuditLog::create([
                'user_id' => Auth::id(),
                'action'  => "Membuat peran baru: {$role->name}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Role {$role->name} berhasil dibuat.",
                'role' => $role
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

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

            \App\Models\AuditLog::create([
                'user_id' => Auth::id(),
                'action'  => "Memperbarui info peran: {$role->name}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil diperbarui.',
                'role' => $role
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id)
    {
        $role = Role::findOrFail($id);

        if (in_array($role->name, ['owner', 'admin', 'cashier'])) {
            return response()->json(['message' => 'Role bawaan sistem diproteksi dan tidak dapat dihapus.'], 400);
        }

        $roleName = $role->name;

        DB::beginTransaction();
        try {
            $role->syncPermissions([]);
            $role->delete();

            \App\Models\AuditLog::create([
                'user_id' => Auth::id(),
                'action'  => "Menghapus peran: {$roleName}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dihapus.'
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updatePermissions(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions'   => ['present', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role->syncPermissions($validated['permissions']);

            \App\Models\AuditLog::create([
                'user_id' => Auth::id(),
                'action'  => "Memperbarui hak akses peran: {$role->name}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hak akses role berhasil diperbarui.'
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
