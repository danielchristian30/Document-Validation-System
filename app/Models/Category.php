<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Models\Activity;
use App\Support\AuditLogger;

class Category extends Model
{
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'name',
    ];

    /**
     * Konfigurasi pencatatan activity log untuk model Category.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('default')          
            ->logFillable()                 
            ->logOnlyDirty()                
            ->dontSubmitEmptyLogs()         
            ->setDescriptionForEvent(function (string $eventName) {
                return match ($eventName) {
                    'created' => 'Membuat kategori dokumen baru.',
                    'updated' => 'Memperbarui nama kategori dokumen.',
                    'deleted' => 'Menghapus kategori dokumen dari sistem.',
                    default   => "Kategori dokumen telah {$eventName}.",
                };
            });
    }

    /**
 * Menambahkan metadata request ke setiap aktivitas model.
 */
    public function tapActivity(Activity $activity, string $eventName): void
    {
        $activity->properties = $activity->properties->merge(
            AuditLogger::requestMetadata()
        );
    }

    // Relasi: satu kategori bisa memiliki banyak dokumen
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}