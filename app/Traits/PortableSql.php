<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

/**
 * Ekspresi SQL yang portabel antara MySQL/MariaDB dan SQLite.
 *
 * Query bawaan MySQL seperti HOUR(), TIMESTAMPDIFF(), dan FIELD() membuat
 * endpoint tertentu error 500 saat dijalankan di SQLite (test suite).
 * Trait ini menerjemahkan ekspresi tersebut sesuai driver database aktif.
 */
trait PortableSql
{
    /**
     * Jam (0-23) dari kolom datetime.
     */
    protected function hourOf(string $column): string
    {
        return match (DB::connection()->getDriverName()) {
            'sqlite' => "strftime('%H', {$column})",
            default  => "HOUR({$column})",
        };
    }

    /**
     * Selisih menit antara dua kolom datetime.
     */
    protected function minutesBetween(string $start, string $end): string
    {
        return match (DB::connection()->getDriverName()) {
            'sqlite' => "(julianday({$end}) - julianday({$start})) * 1440.0",
            default  => "TIMESTAMPDIFF(MINUTE, {$start}, {$end})",
        };
    }

    /**
     * Prioritas urut status (pengganti FIELD() yang hanya ada di MySQL).
     */
    protected function statusPriority(string $column, array $order): string
    {
        $cases = [];
        foreach (array_values($order) as $index => $status) {
            $cases[] = sprintf("WHEN '%s' THEN %d", $status, $index);
        }

        return "CASE {$column} " . implode(' ', $cases) . ' ELSE 999 END';
    }
}
