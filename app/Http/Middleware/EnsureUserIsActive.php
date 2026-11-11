<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Support\AuditLogger;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Memeriksa status akun user
        if ($user && ! (bool) $user->is_active) {
            AuditLogger::log(
                logName: 'security',
                description: 'Akun nonaktif mencoba mengakses sistem.',
                event: 'inactive_account_access',
                customProperties: [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'role' => $user->role,
                ]
            );
        
            // Logout user
            Auth::logout();

            // hapus session dan generate token csrf
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Kembali ke halaman login dengan pesan error
            return redirect()->route('login')->with(
                'error',
                'Akun Anda telah dinonaktifkan. Silakan menghubungi Superadmin.'
            );
        }
        
        return $next($request);
    }
}
