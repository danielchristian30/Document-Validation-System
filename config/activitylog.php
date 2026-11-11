
<?php

return [
    'enabled' => env('ACTIVITY_LOGGER_ENABLED', true),

    'default_log_name' => 'default',

    'default_auth_driver' => null,

    'subject_returns_soft_deleted_models' => false,

    /*
    |--------------------------------------------------------------------------
    | Sensitive Attributes
    |--------------------------------------------------------------------------
    | Atribut yang tidak boleh dicatat ke Activity Log.
    | Pastikan mekanisme pencatatan aplikasi menerapkan daftar ini.
    */
    'ignored_attributes' => [
        'password',
        'password_confirmation',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        // 'api_token',
        // 'access_token',
        // 'refresh_token',
        // 'secret',
    ],
];
