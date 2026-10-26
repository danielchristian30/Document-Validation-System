
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Daftar Role
    |--------------------------------------------------------------------------
    |
    | Role yang boleh dibuat melalui form user.
    | Superadmin tidak dapat dibuat melalui form biasa.
    |
    */

    'roles' => [
        'admin',
        'employee',
    ],

    /*
    |--------------------------------------------------------------------------
    | Daftar Bidang
    |--------------------------------------------------------------------------
    |
    | Bidang yang ada pada Dinas Komunikasi, Informatika, dan Statistik Kota Denpasar
    | saat ini
    */

    'bidang' => [
        'TIK',
        'Statistik',
        'Persandian',
        'PIKP',
        'Sekretariat',
    ],
];
