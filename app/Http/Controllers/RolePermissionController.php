<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of roles with their permissions.
     */
    public function index(Request $request)
    {
        $roles = Role::with('permissions')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->paginate($request->per_page ?? 10);

        $permissions = Permission::all()->groupBy(fn($p) => explode('.', $p->name)[0]);

        return view('shared.user-management.role-permission.index', compact('roles', 'permissions'));
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:100', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dibuat.',
                'data'    => $role->load('permissions'),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified role name.
     */
    public function update(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('roles', 'name')->ignore($id)],
        ]);

        DB::beginTransaction();
        try {
            $role->update(['name' => $validated['name']]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil diperbarui.',
                'data'    => $role->load('permissions'),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(int $id)
    {
        $role = Role::findOrFail($id);

        // Proteksi role super-admin / admin agar tidak bisa dihapus
        if (in_array($role->name, ['super-admin', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Role ini tidak dapat dihapus.',
            ], 403);
        }

        DB::beginTransaction();
        try {
            $role->syncPermissions([]); // Lepas semua permission dulu
            $role->delete();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update permissions for the specified role.
     */
    public function updatePermissions(Request $request, int $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions'   => ['required', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role->syncPermissions($validated['permissions']);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permission role berhasil diperbarui.',
                'data'    => $role->load('permissions'),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
