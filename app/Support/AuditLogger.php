<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;

class AuditLogger
{
    /**
     * Mengambil metadata dari HTTP request saat ini.
     */
    public static function requestMetadata(): array
    {
        $request = request();

        return [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'method' => $request->method(),
            'route' => $request->route()?->getName()
                ?? $request->path(),
        ];
    }

    /**
     * Mencatat aktivitas beserta metadata request.
     */
    public static function log(
        string $logName,
        string $description,
        string $event = 'custom',
        array $customProperties = []
    ): Activity {
        return activity($logName)
            ->causedBy(Auth::user())
            ->event($event)
            ->withProperties(array_merge(
                $customProperties,
                self::requestMetadata()
            ))
            ->log($description);
    }
}
