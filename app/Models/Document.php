<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Models\Activity;
use App\Support\AuditLogger;

class Document extends Model
{
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'category_id',
        'uploader_id',
        'name',
        'file_hash',
        'file_signature',
        'status',
        'error_message',
    ];

    /**
     * Konfigurasi pencatatan activity log untuk model Document.
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
                    'created' => 'Mengunggah dokumen baru ke dalam sistem.',
                    'updated' => 'Memperbarui status atau data dokumen.',
                    'deleted' => 'Menghapus dokumen dari sistem.',
                    default   => "Dokumen telah {$eventName}.",
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

    

    // Relasi bahwa dokumen milik 1 kategori tertentu
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi bahwa dokumen diunggah oleh satu user atau uploader.
    public function uploader(): BelongsTo
    { 
        return $this->belongsTo(User::class, 'uploader_id');
    }
}