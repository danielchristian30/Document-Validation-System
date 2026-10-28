<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Superadmin\DashboardController as SuperadminDashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\Superadmin\UserManagementController as SuperadminUserManagementController;
use App\Http\Controllers\Superadmin\IpBlockListController as SuperadminIpBlockListController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
    
// Routing berdasarkan Role
Route::get('/dashboard', function (Request $request) {
    $role = $request->user()->role;      
    return match($role) {
        'superadmin'    => redirect()->route('superadmin.dashboard'),
        'admin'         => redirect()->route('admin.dashboard'),
        'employee'      => redirect()->route('employee.dashboard'),
        default         => abort(403, 'Role tidak terdaftar'),
    };
})->middleware(['auth'])->name('dashboard');

// Route Superadmin
Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/superadmin/dashboard', [SuperadminDashboardController::class, 'index'])->name('superadmin.dashboard');

    // UserManagement Controller
    Route::get('/superadmin/users', [SuperadminUserManagementController::class, 'index'])->name('superadmin.users.index');
    Route::post('/superadmin/users', [SuperadminUserManagementController::class, 'store'])->name('superadmin.users.store');
    Route::put('/superadmin/users/{user}', [SuperadminUserManagementController::class, 'update'])->name('superadmin.users.update');
    Route::delete('/superadmin/users/{user}', [SuperadminUserManagementController::class, 'destroy'])->name('superadmin.users.destroy');

    // IpBlockList Controller
    Route::get('/superadmin/ip-blocklist', [SuperadminIpBlockListController::class, 'index'])->name('superadmin.ip-blocklist.index');
    Route::post('/superadmin/ip-blocklist', [SuperadminIpBlockListController::class, 'store'])->name('superadmin.ip-blocklist.store');
    Route::delete('/superadmin/ip-blocklist/{blockedIp}', [SuperadminIpBlockListController::class, 'destroy'])->name('superadmin.ip-blocklist.destroy');
    
    Route::get('/superadmin/system-logs', function () { return Inertia::render('Superadmin/SystemLogs/Index'); })->name('superadmin.system-logs.index');

});

// Route Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
});

// Route Employee
Route::middleware(['auth', 'role:employee'])->group(function () {
    Route::get('/employee/dashboard', [EmployeeDashboardController::class, 'index'])->name('employee.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route Validasi Dokumen (Masyarakat)
Route::get('/validasi', function () {
    return Inertia::render('Validation/Index');
})->name('validasi');

require __DIR__.'/auth.php';