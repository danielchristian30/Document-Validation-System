<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'uploader_id',
        'name',
        'file_hash',
        'file_signature',
        'status',
        'error_message',
    ];

    // relasi bahwa dokumen milik 1 kategori tertentu
    public function catagory(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // relasi bahwa dokumen diunggaholeh satu user atau uploader.
    public function uploader(): BelongsTo
    { 
        return $this->belongsTo(User::class, 'uploader_id');
    }
}
