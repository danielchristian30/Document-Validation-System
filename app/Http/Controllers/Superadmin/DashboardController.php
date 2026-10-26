<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Active Users
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalEmployees = User::where('role', 'employee')->count();

        // Blocked IP
        $blockedIPsCount = DB::table('blocked_ips')->count();
        $auditLogsCount = Activity::whereDate('created_at', today())->count();

        // Aktifitas Keamanan
        $recentActivities = Activity::with('causer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                $ip = $activity->properties['ip'] ?? request()->ip();
                
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'causer_name' => $activity->causer ? $activity->causer->name : 'Sistem / Tamu',
                    'ip_address' => $ip,
                    'created_at' => $activity->created_at->format('H:i'),
                    'is_success' => !str_contains(strtolower($activity->description), 'gagal'),
                ];
            });

        return Inertia::render('Superadmin/Dashboard', [
            'stats' => [
                'activeUsers' => $activeUsers,
                'inactiveUsers' => $inactiveUsers,
                'totalAdmins' => $totalAdmins,
                'totalEmployees' => $totalEmployees,
                'blockedIPs' => $blockedIPsCount,
                'auditLogs' => $auditLogsCount,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }
}
