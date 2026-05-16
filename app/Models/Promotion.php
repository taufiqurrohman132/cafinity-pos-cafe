<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'value', 'min_purchase',
        'start_date', 'end_date', 'is_active',
    ];

    protected $casts = [
        'value'        => 'integer',
        'min_purchase' => 'integer',
        'start_date'   => 'date',
        'end_date'     => 'date',
        'is_active'    => 'boolean',
    ];

    // type: percentage, fixed
}