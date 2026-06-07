<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bundle;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BundleController extends Controller
{
    public function index()
    {
        $bundles = Bundle::with('menus')->latest()->paginate(20);
        return response()->json([
            'bundles' => $bundles
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'menus'       => 'nullable|array',
            'menus.*.id'  => 'required|exists:menus,id',
            'menus.*.qty' => 'required|integer|min:1',
        ]);

        $bundle = DB::transaction(function () use ($data) {
            $bundle = Bundle::create(collect($data)->except('menus')->toArray());

            if (!empty($data['menus'])) {
                $sync = collect($data['menus'])->mapWithKeys(fn ($item) => [
                    $item['id'] => ['qty' => $item['qty']],
                ])->all();
                $bundle->menus()->sync($sync);
            }

            return $bundle;
        });

        return response()->json([
            'success' => true,
            'message' => 'Bundle ditambahkan.',
            'bundle' => $bundle
        ]);
    }

    public function show(string $id)
    {
        $bundle = Bundle::with('menus')->findOrFail($id);
        return response()->json([
            'bundle' => $bundle
        ]);
    }

    public function update(Request $request, string $id)
    {
        $bundle = Bundle::findOrFail($id);

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'is_active'   => 'boolean',
            'menus'       => 'nullable|array',
            'menus.*.id'  => 'required|exists:menus,id',
            'menus.*.qty' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($bundle, $data) {
            $bundle->update(collect($data)->except('menus')->toArray());

            if (isset($data['menus'])) {
                $sync = collect($data['menus'])->mapWithKeys(fn ($item) => [
                    $item['id'] => ['qty' => $item['qty']],
                ])->all();
                $bundle->menus()->sync($sync);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Bundle diperbarui.',
            'bundle' => $bundle
        ]);
    }

    public function destroy(string $id)
    {
        Bundle::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Bundle dihapus.'
        ]);
    }
}
