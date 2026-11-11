<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Support\AuditLogger;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Ubah input to lowercase
        $loginInput = Str::lower($this->input('login'));

        // Cek input email atau username
        $loginField = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $this->merge([
            'login' => $loginInput,
            $loginField => $loginInput
        ]);

        if (! Auth::attempt($this->only($loginField, 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Catat Login Gagal ke System Logs
            AuditLogger::log(
                logName: 'authentication',
                description: "Percobaan login gagal oleh {$loginInput}.",
                event: 'login_failed',
                customProperties: [
                    'attempted_login' => $loginInput,
                    'login_field'     => $loginField,
                ]
            );

            throw ValidationException::withMessages([
                'login' => __('auth.failed'),
            ]);
        }

        // Ambil user yang sedang aktif setelah berhasil Auth::attempt
        $user = Auth::user();

        if ($user && !$user->is_active) {
            // Catat Audit Log Login Ditolak (Akun Nonaktif) ke System Logs
            AuditLogger::log(
                logName: 'security',
                description: "Percobaan login ditolak. Akun '{$user->username}' sedang nonaktif.",
                event: 'account_deactivated',
                customProperties: [
                    'user_id'  => $user->id,
                    'username' => $user->username,
                ]
            );

            // Jika akun nonaktif, langsung logout paksa dan gagalkan proses
            Auth::logout();

            throw ValidationException::withMessages([
                'login' => 'Akun Anda telah dinonaktifkan. Silakan menghubungi Superadmin.',
            ]);
        }   

        // Catat Login Berhasil ke System Logs
        AuditLogger::log(
            logName: 'authentication',
            description: "Pengguna {$user->name} dengan role ({$user->role}) berhasil masuk ke sistem.",
            event: 'login',
            customProperties: [
                'user_id'  => $user->id,
                'role'     => $user->role,
            ]
        );

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 15)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('login')).'|'.$this->ip());
    }
}