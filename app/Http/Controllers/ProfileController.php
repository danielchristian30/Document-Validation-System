<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\AuditLogger;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Catat ke System Logs
        AuditLogger::log(
            logName: 'user-management',
            description: "Pengguna {$user->name} memperbarui informasi profil mereka.",
            event: 'profile_updated',
            customProperties: [
                'user_id' => $user->id,
            ]
        );

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->role === 'superadmin') {
            // Catat ke System Logs
            AuditLogger::log(
                logName: 'security',
                description: "Percobaan penghapusan akun Superadmin ditolak secara sistem.",
                event: 'unauthorized_action',
                customProperties: [
                    'user_id' => $user->id,
                ]
            ); 
        
            return back()->withErrors([
                'error' => 'Akun Superadmin bersifat permanen dan tidak dapat dihapus.'
            ]);
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $userId = $user->id;
        $userName = $user->name;

        Auth::logout();
        $user->delete();

        // Catat ke System Logs
        AuditLogger::log(
            logName: 'user-management',
            description: "Pengguna {$userName} menghapus akun mereka sendiri.",
            event: 'account_deleted',
            customProperties: [
                'user_id' => $userId,
            ]
        );

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
