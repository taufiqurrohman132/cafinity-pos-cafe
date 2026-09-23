<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Menguji batas autentikasi & paparan endpoint API.
 *
 * Catatan keamanan yang terdokumentasi di sini:
 * - Semua endpoint di luar POST /api/auth/login wajib token (401 untuk tamu).
 * - Endpoint yang sengaja disembunyikan via ->except([...]) membalas 405.
 * - Saat ini controller API TIDAK membatasi per-role (semua user terautentikasi
 *   boleh memanggil semua endpoint); pembatasan peran yang ada hanya:
 *     * GET /api/dashboard/sales-chart → 403 untuk non-owner
 *     * GET /api/users → Gate 'manage-users' (hanya memengaruhi payload 'can')
 *   Bila nanti diperketat, test eksplisit di bawah wajib diperbarui.
 */
class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private array $protectedEndpoints = [
        'GET /api/dashboard',
        'GET /api/dashboard/sales-chart',
        'PUT /api/profile',
        'GET /api/menus',
        'GET /api/categories',
        'GET /api/inventories',
        'GET /api/suppliers',
        'GET /api/purchase-orders',
        'GET /api/promotions',
        'GET /api/bundles',
        'GET /api/recipe-costing',
        'GET /api/reports',
        'GET /api/targets-goals',
        'GET /api/pos',
        'GET /api/transactions',
        'GET /api/kitchen-orders',
        'GET /api/users',
        'GET /api/user-management/role-permission',
        'GET /api/notifications',
        'GET /api/search',
        'GET /api/settings',
    ];

    public function test_all_protected_endpoints_return_401_for_guests(): void
    {
        foreach ($this->protectedEndpoints as $endpoint) {
            [$method, $uri] = explode(' ', $endpoint, 2);

            $response = match ($method) {
                'GET' => $this->getJson($uri),
                'PUT' => $this->putJson($uri, []),
            };

            $this->assertSame(
                401,
                $response->getStatusCode(),
                "{$endpoint} seharusnya 401 untuk tamu, dapat {$response->getStatusCode()}."
            );
        }
    }

    public function test_login_endpoint_is_public(): void
    {
        $this->postJson('/api/auth/login', [])->assertStatus(422); // validasi, bukan 401
    }

    public function test_hidden_crud_routes_are_not_exposed(): void
    {
        $user = $this->makeUser('owner');
        $this->apiAs($user);

        // GET pada route yang dikecualikan jatuh ke fallback SPA GET (routes/web.php)
        // sehingga membalas 200 HTML — yang dipastikan: route API GET-nya tidak terdaftar.
        foreach ([
            'api/users/{user}',
            'api/promotions/{promotion}',
            'api/targets-goals/{targets_goal}',
            'api/notifications/{notification}',
        ] as $uri) {
            $this->assertApiRouteNotRegistered('GET', $uri);
        }

        // Write-route tersembunji tetap membalas 405: URI-nya cocok dengan metode lain.
        $hiddenRoutes = [
            ['POST', '/api/transactions'],
            ['DELETE', '/api/transactions/1'],
            ['POST', '/api/kitchen-orders'],
            ['PUT', '/api/notifications/1'],
        ];

        foreach ($hiddenRoutes as [$method, $uri]) {
            $response = match ($method) {
                'POST' => $this->postJson($uri, []),
                'PUT' => $this->putJson($uri, []),
                'DELETE' => $this->deleteJson($uri),
            };

            $this->assertSame(
                405,
                $response->getStatusCode(),
                "{$method} {$uri} seharusnya 405 (route disembunyikan), dapat {$response->getStatusCode()}."
            );
        }
    }

    public function test_auth_me_and_logout_require_token(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
        $this->postJson('/api/auth/logout')->assertStatus(401);
    }

    /**
     * Dokumentasi celah otorisasi berjalan: endpoint CRUD belum memeriksa role.
     * Hapus test ini (dan perketat controller) bila pembatasan per-role ditambahkan.
     */
    public function test_role_guards_are_currently_not_enforced_on_crud_endpoints(): void
    {
        $cashier = $this->makeUser('cashier');
        $this->apiAs($cashier);

        // Kasir boleh membuat menu & user saat ini — bukti tidak ada guard per-role.
        $this->postJson('/api/users', [
            'name' => 'Harusnya Ditolak',
            'email' => 'harus.ditolak@example.test',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'admin',
        ])->assertOk();
    }
}
