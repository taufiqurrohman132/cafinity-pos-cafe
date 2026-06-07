<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Search index endpoint.'
        ]);
    }

    public function results(Request $request)
    {
        $query = $request->validate(['q' => 'nullable|string|max:255'])['q'] ?? '';

        $results = Menu::with('category')
            ->where('is_active', true)
            ->when($query, fn ($q) => $q->where('name', 'like', "%{$query}%"))
            ->limit(50)
            ->get();

        return response()->json([
            'results' => $results,
            'query' => $query,
        ]);
    }
}
