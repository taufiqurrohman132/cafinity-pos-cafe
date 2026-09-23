<?php

namespace Tests\Unit\Models;

use App\Models\Promotion;
use Tests\TestCase;

/**
 * Unit test logika jendela aktif Promotion (tanpa DB).
 */
class PromotionTest extends TestCase
{
    public function test_inactive_promotion_is_never_active(): void
    {
        $promo = new Promotion([
            'is_active'  => false,
            'start_date' => now()->subDay()->toDateString(),
            'end_date'   => now()->addDay()->toDateString(),
        ]);

        $this->assertFalse($promo->isCurrentlyActive());
    }

    public function test_promotion_is_active_inside_date_window(): void
    {
        $promo = new Promotion([
            'is_active'  => true,
            'start_date' => now()->subDay()->toDateString(),
            'end_date'   => now()->addDay()->toDateString(),
        ]);

        $this->assertTrue($promo->isCurrentlyActive());
    }

    public function test_promotion_window_includes_boundary_dates(): void
    {
        // start_date == end_date == hari ini tetap aktif (inclusive).
        $promo = new Promotion([
            'is_active'  => true,
            'start_date' => now()->toDateString(),
            'end_date'   => now()->toDateString(),
        ]);

        $this->assertTrue($promo->isCurrentlyActive());
    }

    public function test_promotion_is_inactive_before_start_date(): void
    {
        $promo = new Promotion([
            'is_active'  => true,
            'start_date' => now()->addDay()->toDateString(),
            'end_date'   => now()->addDays(7)->toDateString(),
        ]);

        $this->assertFalse($promo->isCurrentlyActive());
    }

    public function test_promotion_is_inactive_after_end_date(): void
    {
        $promo = new Promotion([
            'is_active'  => true,
            'start_date' => now()->subDays(7)->toDateString(),
            'end_date'   => now()->subDay()->toDateString(),
        ]);

        $this->assertFalse($promo->isCurrentlyActive());
    }

    public function test_boolean_and_value_casts(): void
    {
        $promo = new Promotion([
            'is_active'    => 1,
            'value'        => '20',
            'min_purchase' => '50000',
        ]);

        $this->assertTrue($promo->is_active);
        $this->assertSame(20, $promo->value);
        $this->assertSame(50000, $promo->min_purchase);
    }
}
