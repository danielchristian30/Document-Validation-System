<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Models\Activity;
use App\Support\AuditLogger;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, LogsActivity; // 1. Tambahkan LogsActivity di sini

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'bidang',
        'is_active',
        'deactivated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'deactivated_at'=>'datetime',
        ];
    }

    /**
     * Konfigurasi pencatatan activity log untuk model User.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('user-management')

            // Hanya mencatat atribut yang diizinkan.
            ->logOnly([
                'name',
                'username',
                'email',
                'role',
                'bidang',
                'is_active',
                'deactivated_at',
            ])

            // Hanya mencatat atribut yang benar-benar berubah.
            ->logOnlyDirty()

            // Tidak membuat log jika tidak ada atribut yang relevan untuk dicatat.
            ->dontSubmitEmptyLogs()

            ->setDescriptionForEvent(function (string $eventName) {
                return match ($eventName) {
                    'created' => 'Membuat akun pengguna baru.',
                    'updated' => 'Memperbarui informasi pengguna.',
                    'deleted' => 'Menghapus akun pengguna dari sistem.',
                    default   => "Pengguna telah {$eventName}.",
                };
            });
    }

    /**
     * Menambahkan metadata HTTP Request ke dalam Activity Log.
     */
    /**
 * Menambahkan metadata HTTP Request ke dalam Activity Log.
 */
    public function tapActivity(Activity $activity, string $eventName): void
    {
        // Mengambil pengguna yang melakukan tindakan.
        $actor = Auth::user();

        $actorName = $actor?->name
            ?? $actor?->username
            ?? 'System';

        // Mengambil pengguna yang menjadi target tindakan.
        $targetName = $this->name
            ?? $this->username
            ?? 'pengguna';

        // Menentukan deskripsi berdasarkan jenis aktivitas.
        $activity->description = match ($eventName) {
            'created' => "{$actorName} membuat akun pengguna baru untuk {$targetName}.",

            'updated' => $this->wasChanged('is_active')
                ? (
                    $this->is_active
                        ? "{$actorName} mengaktifkan kembali akun pengguna {$targetName}."
                        : "{$actorName} menonaktifkan akun pengguna {$targetName}."
                )
                : "{$actorName} memperbarui informasi pengguna {$targetName}.",

            'deleted' => "{$actorName} menghapus akun pengguna {$targetName}.",

            default => "{$actorName} melakukan aktivitas {$eventName} pada pengguna {$targetName}.",
        };

        // Menambahkan metadata HTTP Request.
        $activity->properties = $activity->properties->merge(
            AuditLogger::requestMetadata()
        );
    }
    

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'uploader_id');
    }
}