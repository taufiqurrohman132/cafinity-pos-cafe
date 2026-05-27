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
            ->get(); // Diubah menjadi ->get() demi kelancaran komponen tab-detail UI matrix

        return Inertia::render('UserManagement/RolePermission/Index', [
            'roles' => $roles,
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
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            DB::commit();

            return back()->with('success', "Role {$role->name} berhasil dibuat.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
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

        if (in_array($role->name, ['super-admin', 'admin'])) {
            return back()->with('error', 'Role ini diproteksi dan tidak dapat dihapus.');
        }

        DB::beginTransaction();
        try {
            $role->syncPermissions([]);
            $role->delete();
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
            DB::commit();

            return back()->with('success', 'Hak akses role berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }
}
