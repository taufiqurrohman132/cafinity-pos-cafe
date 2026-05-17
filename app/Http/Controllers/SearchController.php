<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SearchController extends Controller
{
    public function index(): View
    {
        return view('shared.search.index');
    }

    public function results(Request $request): View
    {
        $query = $request->validate(['q' => 'nullable|string|max:255'])['q'] ?? '';

        $results = Menu::with('category')
            ->where('is_active', true)
            ->when($query, fn ($q) => $q->where('name', 'like', "%{$query}%"))
            ->limit(50)
            ->get();

        return view('shared.search.results', compact('results', 'query'));
    }
}
