<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Target extends Model
{
    use HasFactory;

    protected $fillable = [
        'label', 'type', 'target_value', 'current_value',
        'period', 'start_date', 'end_date',
    ];

    protected $casts = [
        'target_value'  => 'integer',
        'current_value' => 'integer',
        'start_date'    => 'date',
        'end_date'      => 'date',
    ];

    // type: revenue, orders, profit

    public function getProgressAttribute()
    {
        if ($this->target_value == 0) return 0;
        return round(($this->current_value / $this->target_value) * 100, 1);
    }
}