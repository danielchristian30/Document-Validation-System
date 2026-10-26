<?php

namespace App\Http\Controllers\Superadmin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(
            $request->user()->role === 'superadmin',
            403,
            'Akses hanya untuk superadmin.'
        );

        $request->validate([
            'bidang' => [
                'nullable',
                Rule::in(config('access.bidang')),
            ],
        ]);

        $query = User::query();

        if ($request->filled('bidang')) {
            $query->where('bidang', $request->bidang);
        }

        return Inertia::render('Superadmin/Users/Index', [
            'users' => $query->latest()->get(),
            'rolesList' => config('access.roles'),
            'bidangList' => config('access.bidang'),
            'currentUserRole' => 'superadmin',
            'selectedBidang' => $request->bidang,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(
            $request->user()->role === 'superadmin',
            403,
            'Akses hanya untuk superadmin.'
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                'unique:users,email',
            ],
            'password' => ['required', 'string', 'min:8'],
            'role' => [
                'required',
                Rule::in(config('access.roles')),
            ],
            'bidang' => [
                'required',
                Rule::in(config('access.bidang')),
            ],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'bidang' => $validated['bidang'],
            'is_active' => true,
        ]);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    
    public function update(Request $request, User $user)
    {
        abort_unless(
            $request->user()->role === 'superadmin',
            403,
            'Akses hanya untuk superadmin.'
        );

        // Lindungi akun superadmin dari perubahan melalui fitur ini.
        if ($user->role === 'superadmin') {
            return back()->with(
                'error',
                'Akun superadmin tidak dapat diedit melalui fitur ini.'
            );
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => [
                'nullable', 'string', 'min:8', 'confirmed',
            ],
            'role' => [
                'required',
                Rule::in(config('access.roles')),
            ],
            'bidang' => [
                'required',
                Rule::in(config('access.bidang')),
            ],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'bidang' => $validated['bidang'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return back()->with('success', 'Data user berhasil diperbarui.');
    }

    
/**
 * Menonaktifkan atau mengaktifkan kembali user.
 * Menggunakan soft delete berbasis periode waktu, bukan menghapus data secara permanen secara langsung.
 */
    public function destroy(Request $request, User $user)
        {
            abort_unless(
                $request->user()->role === 'superadmin',
                403,
                'Akses hanya untuk superadmin.'
            );

            if ((string) $request->user()->id === (string) $user->id) {
                return back()->with(
                    'error',
                    'Anda tidak dapat menonaktifkan akun sendiri.'
                );
            }

            if ($user->role === 'superadmin') {
                return back()->with(
                    'error',
                    'Akun Superadmin tidak bisa dinonaktifkan.'
                );
            }

            $newActiveState = !(bool) $user->is_active;

            $user->update([
                'is_active' => $newActiveState,
                'deactivated_at' => $newActiveState ? null : now(),
            ]);

            return back()->with(
                'success',
                $newActiveState
                    ? 'Akun berhasil diaktifkan kembali.'
                    : 'Akun berhasil dinonaktifkan.'
            );
        }

}

