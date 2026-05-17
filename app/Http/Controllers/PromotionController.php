<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PromotionController extends Controller
{
    public function index(): View
    {
        $promotions = Promotion::latest()->paginate(20);

        return view('shared.promotion.index', compact('promotions'));
    }

    public function create(): View
    {
        return view('shared.promotion.create');
    }

    public function store(Request $request)
    {
        Promotion::create($request->validate([
            'name'         => 'required|string|max:255',
            'type'         => 'required|in:percentage,fixed',
            'value'        => 'required|integer|min:0',
            'min_purchase' => 'nullable|integer|min:0',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after_or_equal:start_date',
            'is_active'    => 'boolean',
        ]));

        return redirect()->route('promotions.index')->with('success', 'Promosi ditambahkan.');
    }

    public function show(string $id): View
    {
        $promotion = Promotion::findOrFail($id);

        return view('shared.promotion.show', compact('promotion'));
    }

    public function edit(string $id): View
    {
        $promotion = Promotion::findOrFail($id);

        return view('shared.promotion.edit', compact('promotion'));
    }

    public function update(Request $request, string $id)
    {
        Promotion::findOrFail($id)->update($request->validate([
            'name'         => 'required|string|max:255',
            'type'         => 'required|in:percentage,fixed',
            'value'        => 'required|integer|min:0',
            'min_purchase' => 'nullable|integer|min:0',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after_or_equal:start_date',
            'is_active'    => 'boolean',
        ]));

        return redirect()->route('promotions.index')->with('success', 'Promosi diperbarui.');
    }

    public function destroy(string $id)
    {
        Promotion::findOrFail($id)->delete();

        return redirect()->route('promotions.index')->with('success', 'Promosi dihapus.');
    }
}
