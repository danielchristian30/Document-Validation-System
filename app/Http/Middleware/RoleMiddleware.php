<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Support\AuditLogger;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles) : Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if(! in_array($request->user()->role, $roles, true)) {
            AuditLogger::log(
                logName: 'security',
                description: 'Akses ditolak: Pengguna mencoba membuka halaman tanpa hak akses yang sesuai.',
                event: 'access_denied',
                customProperties: [
                    'required_roles' => $roles,
                    'user_role' => $request->user()->role,
                ]
            );

            abort(403, 'Akses ditolak. Anda tidak memiliki hak untuk membuka halaman ini.');
        } 
        
        return $next($request);
    }
}
