<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Spatie\Activitylog\Models\Activity;

class SystemLogController extends Controller
{
    /**
     * Menampilkan halaman System Logs.
     */
    public function index(Request $request): InertiaResponse
    {
        // Validasi parameter input dari frontend
        $validated = $request->validate([
            'search'   => ['nullable', 'string', 'max:100'],
            'log_name' => ['nullable', 'in:default,authentication,user-management,security'],
            'role'     => ['nullable', 'in:Superadmin,Admin,Pegawai'],
            'date'     => ['nullable', 'in:Semua Waktu,Hari Ini,7 Hari Terakhir'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
        ]);

        $search  = trim($validated['search'] ?? '');
        $logName = $validated['log_name'] ?? null;
        $role    = $validated['role'] ?? null;
        $date    = $validated['date'] ?? 'Semua Waktu';
        $perPage = (int) ($validated['per_page'] ?? 10);

        // Query dasar dengan Eager Loading untuk mencegah N+1 query
        $query = Activity::query()
            ->select([
                'id', 'log_name', 'description', 'event',
                'subject_type', 'subject_id', 'causer_type',
                'causer_id', 'properties', 'batch_uuid',
                'created_at', 'updated_at',
            ])
            ->with(['causer:id,name,username,role']);

        // Filter pencarian teks global
        if ($search !== '') {
            $keyword = '%' . $search . '%';

            $query->where(function ($q) use ($keyword) {
                $q->where('description', 'ilike', $keyword)
                    ->orWhere('log_name', 'ilike', $keyword)
                    ->orWhere('event', 'ilike', $keyword)
                    ->orWhere('subject_type', 'ilike', $keyword)
                    ->orWhere('properties->ip', 'ilike', $keyword)
                    ->orWhere('properties->user_agent', 'ilike', $keyword)
                    ->orWhere('properties->method', 'ilike', $keyword)
                    ->orWhere('properties->route', 'ilike', $keyword)
                    ->orWhereHasMorph(
                        'causer',
                        [User::class],
                        function ($userQuery) use ($keyword) {
                            $userQuery->where('name', 'ilike', $keyword)
                                ->orWhere('username', 'ilike', $keyword);
                        }
                    );
            });
        }

        // Filter berdasarkan kategori log
        if ($logName !== null) {
            $query->where('log_name', $logName);
        }

        // Filter berdasarkan role pengguna
        if ($role !== null) {
            $roleValue = match ($role) {
                'Superadmin' => 'superadmin',
                'Admin'      => 'admin',
                'Pegawai'    => 'employee',
            };

            $query->whereHasMorph(
                'causer',
                [User::class],
                function ($userQuery) use ($roleValue) {
                    $userQuery->where('role', $roleValue);
                }
            );
        }

        // Filter berdasarkan rentang waktu
        if ($date === 'Hari Ini') {
            $startDate = today()->startOfDay();
            $endDate   = today()->addDay()->startOfDay();

            $query->where('created_at', '>=', $startDate)
                ->where('created_at', '<', $endDate);
        } elseif ($date === '7 Hari Terakhir') {
            $startDate = today()->subDays(6)->startOfDay();
            $endDate   = today()->addDay()->startOfDay();

            $query->where('created_at', '>=', $startDate)
                ->where('created_at', '<', $endDate);
        }

        // Agregasi statistik ringkasan dengan Cache (5 detik)
        $stats = Cache::remember(
            'system_logs:stats:' . today()->toDateString(),
            now()->addSeconds(5),
            function () {
                $activityModel = new Activity();
                $userModel     = new User();

                $activityTable = $activityModel->getTable();
                $userTable     = $userModel->getTable();
                $userMorphType = $userModel->getMorphClass();

                $startOfToday    = today()->startOfDay();
                $startOfTomorrow = today()->addDay()->startOfDay();

                $statsRow = DB::table($activityTable . ' as activities')
                    ->leftJoin(
                        $userTable . ' as causers',
                        function ($join) use ($userMorphType) {
                            $join->on('activities.causer_id', '=', 'causers.id')
                                 ->where('activities.causer_type', '=', $userMorphType);
                        }
                    )
                    ->selectRaw('COUNT(*) AS total')
                    ->selectRaw(
                        'COUNT(*) FILTER (WHERE activities.created_at >= ? AND activities.created_at < ?) AS today',
                        [$startOfToday, $startOfTomorrow]
                    )
                    ->selectRaw('COUNT(*) FILTER (WHERE causers.role = ?) AS admin', ['admin'])
                    ->selectRaw('COUNT(*) FILTER (WHERE causers.role = ?) AS employee', ['employee'])
                    ->first();

                return [
                    'total'    => (int) ($statsRow->total ?? 0),
                    'today'    => (int) ($statsRow->today ?? 0),
                    'admin'    => (int) ($statsRow->admin ?? 0),
                    'employee' => (int) ($statsRow->employee ?? 0),
                ];
            }
        );

        // Eksekusi Server-side Pagination
        $logs = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        // Transformasi data payload untuk frontend React
        $logs->through(function (Activity $log) {
            $causer = $log->causer;

            $causerName = $causer?->name
                ?? $causer?->username
                ?? 'System / Guest';

            $causerRole = match ($causer?->role) {
                'superadmin' => 'Superadmin',
                'admin'      => 'Admin',
                'employee'   => 'Pegawai',
                default      => $causer ? 'User' : 'System',
            };

            return [
                'id'           => $log->id,
                'log_name'     => $log->log_name ?? 'default',
                'description'  => $log->description,
                'event'        => $log->event,
                'subject_type' => $log->subject_type,
                'subject_id'   => $log->subject_id,
                'causer_type'  => $log->causer_type,
                'causer_id'    => $log->causer_id,
                'causer_name'  => $causerName,
                'causer_role'  => $causerRole,
                'properties'   => $log->properties?->toArray() ?? [],
                'batch_uuid'   => $log->batch_uuid,
                'created_at'   => $log->created_at?->toIso8601String(),
                'updated_at'   => $log->updated_at?->toIso8601String(),
            ];
        });

        
        return Inertia::render('Superadmin/SystemLogs/Index', [
            'logs'    => $logs,
            'stats'   => $stats,
            'filters' => [
                'search'   => $search,
                'log_name' => $logName ?? 'Semua Log',
                'role'     => $role ?? 'Semua Role',
                'date'     => $date,
                'per_page' => $perPage,
            ],
        ]);
    }
}