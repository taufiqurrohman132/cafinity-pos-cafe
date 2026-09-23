<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Support\Facades\Cache;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    /**
     * Find the token instance matching the given token.
     *
     * @param  string  $token
     * @return static|null
     */
    public static function findToken($token)
    {
        // Kunci cache harus bisa dihitung ulang dari data yang tersimpan di row
        // (hash secret) agar save()/delete() benar-benar meng-invalidasinya.
        // Meng-hash seluruh string bearer "id|secret" membuat kunci berbeda dari
        // yang di-forget delete(), sehingga token yang sudah dicabut masih lolos
        // autentikasi dari cache sampai TTL (5 menit) habis.
        $secret = str_contains($token, '|') ? explode('|', $token, 2)[1] : $token;
        $hashedToken = hash('sha256', $secret);

        $attributes = Cache::remember("sanctum_token:{$hashedToken}", 300, function () use ($token) {
            $tokenInstance = parent::findToken($token);
            return $tokenInstance ? $tokenInstance->getAttributes() : null;
        });

        if (!$attributes) {
            return null;
        }

        return (new static)->newFromBuilder($attributes);
    }

    /**
     * Save the model to the database.
     *
     * @param  array  $options
     * @return bool
     */
    public function save(array $options = [])
    {
        // If only updating last_used_at, throttle the write to once every 5 minutes
        if ($this->isDirty('last_used_at') && count($this->getDirty()) === 1) {
            $lastUsed = $this->getOriginal('last_used_at');
            if ($lastUsed && now()->parse($lastUsed)->diffInMinutes(now()) < 5) {
                return true; // Skip saving to avoid database write overhead
            }
        }

        $saved = parent::save($options);

        if ($saved) {
            // Invalidate the cache to ensure we fetch fresh data on next read
            $tokenRaw = strpos($this->token, '|') === false ? $this->token : explode('|', $this->token, 2)[1];
            Cache::forget("sanctum_token:{$tokenRaw}");
            Cache::forget("sanctum_token:{$this->token}");
        }

        return $saved;
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null
     */
    public function delete()
    {
        $deleted = parent::delete();

        if ($deleted) {
            $tokenRaw = strpos($this->token, '|') === false ? $this->token : explode('|', $this->token, 2)[1];
            Cache::forget("sanctum_token:{$tokenRaw}");
            Cache::forget("sanctum_token:{$this->token}");
        }

        return $deleted;
    }
}
