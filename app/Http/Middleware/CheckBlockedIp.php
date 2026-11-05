<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\BlockedIp;
use Symfony\Component\HttpFoundation\Response;

class CheckBlockedIp
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clientIp = $request->ip();

        $blockedIps = Cache::remember(
            'system_blocked_ips',
            600,
            function () {
                return BlockedIp::query()
                    ->where(function ($query) {
                        $query->whereNull('expires_at')
                            ->orWhere('expires_at', '>', now());
                    })
                    ->pluck('ip_address')
                    ->all();
            }
        );

        if (in_array($clientIp, $blockedIps, true)) {
            abort(
                403,
                'Akses ditolak : Alamat IP anda telah diblokir oleh sistem keamanan.'
            );
        }

        return $next($request);
    }
}
