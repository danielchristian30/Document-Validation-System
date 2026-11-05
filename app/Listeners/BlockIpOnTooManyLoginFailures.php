<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Cache;
use Illuminate\Auth\Events\Failed;
use App\Models\BlockedIp;

class BlockIpOnTooManyLoginFailures
{

    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        $ip = request()->ip();

        if (!$ip) {
            return;
        }

        $cacheKey = "login_failures_ip:{$ip}";

        // Set nilai dan masa berlaku untuk inisialisasi awal
        Cache::add($cacheKey, 0, now()->addMinutes(15)); 

        // Penambahan nilai dilakukan secara atomik oleh cache store
        $attemps = Cache::increment($cacheKey);

        if ($attemps <= 10) {
            return;
        }


        BlockedIp::updateOrCreate(
            ['ip_address' => $ip],
            [
                'reason' => 'Percobaan login gagal melebihi 10 kali.',
                'source' => 'automatic',
                'expires_at' => now()->addDay(),
            ]
        );

        Cache::forget('system_blocked_ips');
        Cache::forget($cacheKey);
    }   
}
