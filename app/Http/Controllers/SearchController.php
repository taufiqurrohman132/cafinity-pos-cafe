<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    //
    public function index()
    {
        return view('search.index');
    }

    public function results(Request $request)
    {
        $query = $request->input('q');
        $results = MenuItem::where('name', 'like', "%$query%")->get();
        return view('search.results', compact('results', 'query'));
    }
}
