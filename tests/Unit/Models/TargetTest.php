<?php

namespace Tests\Unit\Models;

use App\Models\Target;
use Tests\TestCase;

/**
 * Unit test accessor progress Target (tanpa DB — cukup instance model).
 */
class TargetTest extends TestCase
{
    public function test_progress_is_percentage_of_current_over_target(): void
    {
        $target = new Target([
            'target_value'  => 200000,
            'current_value' => 50000,
        ]);

        $this->assertSame(25.0, $target->progress);
    }

    public function test_progress_is_zero_when_target_value_is_zero(): void
    {
        // Guard div nol: target 0 tidak boleh membagi nol (NaN/Infinity).
        $target = new Target([
            'target_value'  => 0,
            'current_value' => 1000,
        ]);

        $this->assertSame(0, $target->progress);
    }

    public function test_progress_is_rounded_to_one_decimal(): void
    {
        $target = new Target([
            'target_value'  => 3,
            'current_value' => 1,
        ]);

        $this->assertSame(33.3, $target->progress);
    }

    public function test_progress_can_exceed_one_hundred_percent(): void
    {
        // Aplikasi sengaja tidak memotong progress > 100% di level model.
        $target = new Target([
            'target_value'  => 100,
            'current_value' => 250,
        ]);

        $this->assertSame(250.0, $target->progress);
    }

    public function test_values_are_cast_to_integer(): void
    {
        $target = new Target([
            'target_value'  => '1500',
            'current_value' => '750',
        ]);

        $this->assertSame(1500, $target->target_value);
        $this->assertSame(750, $target->current_value);
    }
}
