<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\BlockedIp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use PhpParser\Node\Stmt\Block;

class IpBlockListController extends Controller
{
    /**
     * Menampilkan daftar IP yang diblokir.
     */

    public function index(): InertiaResponse 
    {
        $blockedIps = BlockedIp::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Superadmin/IpBlocklist/Index', [
            'blockedIps' => $blockedIps,
        ]); 
    }

     /**
     * Memblokir IP secara manual oleh Superadmin.
     */
     public function store(Request $request): RedirectResponse
     {
        $validated = $request->validate([
            'ip_address' => [
                'required',
                'string',
                'ip',
                Rule::unique('blocked_ips', 'ip_address'),
            ],
            'reason' => ['nullable', 'string', 'max:255'],
        ], [
            'ip_address.required' => 'Alamat IP wajib diisi.',
            'ip_address.ip' => 'Format alamat IP tidak valid.',
            'ip_address.unique' => 'Alamat IP sudah terdaftar.',
        ]);

        $ipAddress = trim($validated['ip_address']);

        BlockedIp::create([
            'ip_address' => $ipAddress,
            'reason' => $validated['reason'] ?? null,
            'source' => 'manual',
        ]);

        Cache::forget('system_blocked_ips');

        return back()->with(
            'success',
            'Alamat IP berhasil diblokir.'
        );
     }

     /**
     * Membuka blokir IP.
     */
    public function destroy(BlockedIp $blockedIp): RedirectResponse
    {
        $blockedIp->delete();

        Cache::forget('system_blocked_ips');

        return back()->with(
            'success',
            'Blokir IP berhasil dicabut.'
        );
    }
}
