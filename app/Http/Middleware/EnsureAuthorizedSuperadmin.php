<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAuthorizedSuperadmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'superadmin') {
            $whitelist = config('access.superadmin_emails', []);

            $authorized = is_array($whitelist) && in_array(
                strtolower(trim($user->email)),
                array_map(
                    fn ($email) => strtolower(trim($email)),
                    $whitelist
                ),
                true
            );

            abort_unless(
                $authorized,
                403,
                'Akses ditolak: Akun superadmin tidak terdaftar dalam whitelist.'
            );
        }

        return $next($request);
    }
}
