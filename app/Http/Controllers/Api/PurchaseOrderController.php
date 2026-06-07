<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
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

        return response()->json([
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

    public function create()
    {
        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::with('category')->orderBy('name')->get();

        return response()->json([
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

        $order = DB::transaction(function () use ($data) {
            $total = collect($data['items'])->sum(fn($item) => (int) ($item['qty'] * $item['price_per_unit']));

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

            return $order;
        });

        return response()->json([
            'success' => true,
            'message' => 'PO dibuat.',
            'order' => $order
        ]);
    }

    public function show(string $id)
    {
        $order = PurchaseOrder::with([
            'items.inventory.category',
            'supplier',
            'user',
            'createdBy',
            'approvals.approver'
        ])->findOrFail($id);

        $auditLogs = \App\Models\AuditLog::where('target_type', PurchaseOrder::class)
            ->where('target_id', $id)
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'order'       => $order,
            'auditLogs'   => $auditLogs,
            'currentUser' => auth()->user(),
        ]);
    }

    public function edit(string $id)
    {
        $order = PurchaseOrder::with('items.inventory.category')->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'PO tidak dapat diedit.'], 400);
        }

        $suppliers = Supplier::where('is_active', true)->orderBy('name')->get();
        $inventories = Inventory::with('category')->orderBy('name')->get();

        return response()->json([
            'order'       => $order,
            'suppliers'   => $suppliers,
            'inventories' => $inventories,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'PO tidak dapat diperbarui.'], 400);
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

        return response()->json([
            'success' => true,
            'message' => 'PO diperbarui.',
            'order' => $order
        ]);
    }

    public function destroy(string $id)
    {
        $order = PurchaseOrder::findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'PO tidak dapat dihapus.'], 400);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'PO dihapus.'
        ]);
    }

    public function approve(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'approved']);

        return response()->json([
            'success' => true,
            'message' => 'PO disetujui.'
        ]);
    }

    public function reject(string $id)
    {
        PurchaseOrder::where('id', $id)->where('status', 'pending')->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'PO ditolak.'
        ]);
    }

    public function receive(string $id)
    {
        $order = PurchaseOrder::with('items')->findOrFail($id);

        if ($order->status !== 'approved') {
            return response()->json(['message' => 'PO harus disetujui terlebih dahulu.'], 400);
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

        return response()->json([
            'success' => true,
            'message' => 'Barang diterima, stok diperbarui.'
        ]);
    }
}
