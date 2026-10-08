<?php

namespace Tests;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

abstract class TestCase extends BaseTestCase
{
    /**
     * Vite tidak di-build di job CI PHPUnit (hanya di job E2E), sehingga
     * public/build/manifest.json tidak ada. Nonaktifkan Vite saat testing
     * supaya render view (Blade) tidak bergantung pada aset hasil build.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    /**
     * Seed permissions & roles (idempotent, dipanggil sekali per test saat perlu).
     */
    protected function seedRoles(): void
    {
        // RoleSeeder membuat permission dengan guard default — paksa 'web' selama seeding
        // lalu kembalikan (bisa saja sudah 'sanctum' karena Sanctum::actingAs).
        $previous = config('auth.defaults.guard');
        config(['auth.defaults.guard' => 'web']);

        $this->seed(RoleSeeder::class);

        config(['auth.defaults.guard' => $previous]);
    }

    /**
     * Buat user aktif dengan role Spatie tertentu.
     */
    protected function makeUser(string $role = 'cashier', array $attributes = []): User
    {
        if (! Role::where('name', $role)->exists()) {
            $this->seedRoles();
        }

        $user = User::factory()->create(array_merge([
            'role'   => $role,
            'status' => 'active',
        ], $attributes));

        // Sync lewat relasi + role id eksplisit agar tidak bergantung pada
        // default guard Spatie yang bisa berubah menjadi 'sanctum' (Sanctum::actingAs).
        $user->roles()->sync([Role::findByName($role, 'web')->id]);

        return $user;
    }

    /**
     * Autentikasi request API berikutnya sebagai user tersebut (Sanctum token).
     */
    protected function apiAs(User $user): static
    {
        Sanctum::actingAs($user);

        return $this;
    }

    /**
     * Memastikan tidak ada route API terdaftar untuk method + URI template tertentu.
     *
     * Diperlukan untuk route yang disembunyikan via ->except([...]) pada bagian GET:
     * request GET akan jatuh ke fallback SPA di routes/web.php (Route::get('/{any}'))
     * dan membalas 200 HTML, sehingga asersi 405 tidak berlaku.
     */
    protected function assertApiRouteNotRegistered(string $method, string $uri): void
    {
        $matches = collect(app('router')->getRoutes()->getRoutes())->filter(
            fn ($route) => $route->uri() === $uri
                && in_array(strtoupper($method), $route->methods(), true)
        );

        $this->assertTrue(
            $matches->isEmpty(),
            "Route {$method} {$uri} seharusnya tidak terdaftar (tersembunyi lewat ->except())."
        );
    }
}
