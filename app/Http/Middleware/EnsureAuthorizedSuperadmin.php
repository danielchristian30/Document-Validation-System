<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Support\AuditLogger;

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

        // Cek Superadmin berdasarkan whitelist email
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

            // Hapus Session Login
            if (!$authorized) {
                 AuditLogger::log(
                    logName: 'security',
                    description: 'Superadmin ditolak karena tidak terdaftar dalam whitelist.',
                    event: 'unauthorized_superadmin',
                    customProperties: [
                        'user_id' => $user->id,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                    ]
                );
            
                Auth::logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                abort(
                    403,
                    'Akses ditolak: Akun superadmin tidak terdaftar dalam whitelist.'
                );
                
                // abort_unless(
                //     $authorized,
                //     403,
                //     'Akses ditolak: Akun superadmin tidak terdaftar dalam whitelist.'
                // );

                return redirect()->route('login');
            }

            // return redirect()->route('login')->with(
            //     'error',
            //     'Akun Anda telah dinonaktifkan. Silakan menghubungi Superadmin.'
            // );
        }

        return $next($request);
    }
}
