<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{

    public function index(Request $request): Response
    {
        $query = PurchaseOrder::with(['supplier', 'user', 'createdBy']);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                  ->orWhereHas('supplier', function($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(20)->withQueryString();

        // Calculate stats
        $totalOrders = PurchaseOrder::count();
        $pendingApprovals = PurchaseOrder::where('status', 'pending')->count();
        $waitingDelivery = PurchaseOrder::where('status', 'approved')->count();
        
        $urgentOrders = PurchaseOrder::where('status', 'pending')
            ->where(function($q) {
                $q->whereNull('delivery_date')
                  ->orWhere('delivery_date', '<=', now()->addDays(3));
            })->count();
            
        $lateDeliveries = PurchaseOrder::where('status', 'approved')
            ->where('delivery_date', '<', now()->toDateString())
            ->count();

        // Recent approvals timeline data
        $recentApprovals = \App\Models\PoApproval::with(['approver', 'purchaseOrder'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($appr) {
                return [
                    'purchase_order_id' => $appr->purchase_order_id,
                    'status' => $appr->status,
                    'approver' => [
                        'name' => $appr->approver?->name,
                    ],
                    'purchase_order' => [
                        'po_number' => $appr->purchaseOrder?->po_number,
                    ],
                    'acted_at_diff' => $appr->acted_at ? $appr->acted_at->diffForHumans() : $appr->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('PurchaseOrder/Index', [
            'orders'          => $orders,
            'filters'         => $request->only(['search', 'status']),
            'stats'           => [
                'total_orders'       => $totalOrders,
                'pending_approvals'  => $pendingApprovals,
                'waiting_delivery'   => $waitingDelivery,
                'urgent_orders'      => $urgentOrders,
                'late_deliveries'    => $lateDeliveries,
            ],
            'recentApprovals' => $recentApprovals,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::with('category')->orderBy('name')->get();

        return Inertia::render('PurchaseOrder/Create', [
            'suppliers'   => $suppliers,
            'inventories' => $inventories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id'              => 'required|exists:suppliers,id',
            'delivery_location'        => 'nullable|string|max:255',
            'delivery_date'            => 'nullable|date',
            'reference_number'         => 'nullable|string|max:255',
            'notes'                    => 'nullable|string',
            'items'                    => 'required|array|min:1',
            'items.*.inventory_id'     => 'required|exists:inventories,id',
            'items.*.qty'              => 'required|numeric|min:0.01',
            'items.*.unit'             => 'required|string|max:50',
            'items.*.price_per_unit'   => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $total = collect($data['items'])->sum(fn($item) => (int) ($item['qty'] * $item['price_per_unit']));

            // Generate unique PO number (e.g., PO-YYYY-XXXX)
            $year = date('Y');
            $count = PurchaseOrder::whereYear('created_at', $year)->count() + 1;
            $poNumber = sprintf('PO-%d-%04d', $year, $count);

            $order = PurchaseOrder::create([
                'supplier_id'       => $data['supplier_id'],
                'user_id'           => auth()->id(),
                'po_number'         => $poNumber,
                'delivery_location' => $data['delivery_location'] ?? null,
                'delivery_date'     => $data['delivery_date'] ?? null,
                'reference_number'  => $data['reference_number'] ?? null,
                'status'            => 'pending',
                'total_amount'      => $total,
                'notes'             => $data['notes'] ?? null,
                'created_by'        => auth()->id(),
                'ordered_at'        => now(),
            ]);

            foreach ($data['items'] as $item) {
                $subtotal = (int) ($item['qty'] * $item['price_per_unit']);
                $order->items()->create([
                    'inventory_id'   => $item['inventory_id'],
                    'qty'            => $item['qty'],
                    'unit'           => $item['unit'],
                    'price_per_unit' => $item['price_per_unit'],
                    'subtotal'       => $subtotal,
                ]);
            }
        });

        return redirect()->route('purchase-orders.index')->with('success', 'PO dibuat.');
    }

    public function show(string $id): Response
    {
        $order = PurchaseOrder::with([
            'items.inventory.category',
            'supplier',
            'user',
            'createdBy',
            'approvals.approver'
        ])->findOrFail($id);

        // Fetch audit logs related to this Purchase Order
        $auditLogs = \App\Models\AuditLog::where('target_type', PurchaseOrder::class)
            ->where('target_id', $id)
            ->with('user')
            ->latest()
            ->get();

        return Inertia::render('PurchaseOrder/Show', [
            'order'       => $order,
            'auditLogs'   => $auditLogs,
            'currentUser' => auth()->user(),
        ]);
    }

    public function edit(string $id): Response|RedirectResponse
    {
        $order = PurchaseOrder::with('items.inventory.category')->findOrFail($id);

        if ($order->status !== 'pending') {
            return redirect()->route('purchase-orders.show', $order->id)
                ->with('error', 'PO tidak dapat diedit.');
        }

        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::with('category')->orderBy('name')->get();

        return Inertia::render('PurchaseOrder/Edit', [
            'order'       => $order,
            'suppliers'   => $suppliers,
            'inventories' => $inventories,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return redirect()->route('purchase-orders.show', $order->id)
                ->with('error', 'PO tidak dapat diperbarui.');
        }

        $data = $request->validate([
            'supplier_id'              => 'required|exists:suppliers,id',
            'delivery_location'        => 'nullable|string|max:255',
            'delivery_date'            => 'nullable|date',
            'reference_number'         => 'nullable|string|max:255',
            'notes'                    => 'nullable|string',
            'items'                    => 'required|array|min:1',
            'items.*.inventory_id'     => 'required|exists:inventories,id',
            'items.*.qty'              => 'required|numeric|min:0.01',
            'items.*.unit'             => 'required|string|max:50',
            'items.*.price_per_unit'   => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($order, $data) {
            $total = collect($data['items'])->sum(fn($item) => (int) ($item['qty'] * $item['price_per_unit']));

            $order->update([
                'supplier_id'       => $data['supplier_id'],
                'delivery_location' => $data['delivery_location'] ?? null,
                'delivery_date'     => $data['delivery_date'] ?? null,
                'reference_number'  => $data['reference_number'] ?? null,
                'total_amount'      => $total,
                'notes'             => $data['notes'] ?? null,
            ]);

            // Sync items: delete old items and insert new ones
            $order->items()->delete();

            foreach ($data['items'] as $item) {
                $subtotal = (int) ($item['qty'] * $item['price_per_unit']);
                $order->items()->create([
                    'inventory_id'   => $item['inventory_id'],
                    'qty'            => $item['qty'],
                    'unit'           => $item['unit'],
                    'price_per_unit' => $item['price_per_unit'],
                    'subtotal'       => $subtotal,
                ]);
            }
        });

        return redirect()->route('purchase-orders.show', $order->id)->with('success', 'PO diperbarui.');
    }

    public function destroy(string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return back()->with('error', 'PO tidak dapat dihapus.');
        }

        $order->delete();

        return redirect()->route('purchase-orders.index')->with('success', 'PO dihapus.');
    }

    public function approve(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'approved']);

        return back()->with('success', 'PO disetujui.');
    }

    public function reject(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'rejected']);

        return back()->with('success', 'PO ditolak.');
    }

    public function receive(string $id)
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);

        if ($order->status !== 'approved') {
            return back()->with('error', 'PO harus disetujui terlebih dahulu.');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $inventory = Inventory::find($item->inventory_id);

                if ($inventory) {
                    $inventory->adjustStock((float) $item->qty, 'in', "PO #{$order->id}");
                }
            }

            $order->update(['status' => 'received', 'received_at' => now()]);
        });

        return back()->with('success', 'Barang diterima, stok diperbarui.');
    }
}
