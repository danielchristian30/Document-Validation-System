
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

    /*
    |--------------------------------------------------------------------------
    | whitelist email superadmin
    |--------------------------------------------------------------------------
    |
    | email superadmin yang sah
    | 
    */

    'superadmin_emails' => [
        'superadmin@denpasarkota.com',
    ],

    /*
    |--------------------------------------------------------------------------
    | Opsi Alasan Pemblokiran Manual
    |--------------------------------------------------------------------------
    |
    | Alasan pemblokiran yang dilakukan secara manual oleh superadmin
    | 
    */

    'ip_block_reasons' => [
        'Percobaan Masuk Gagal Berkali-kali (Brute Force)',
        'Aktivitas Trafik Berlebihan (DDoS / Flooding)',
        'Percobaan Akses Area Terlarang (Unauthorized Access)',
        'Pengiriman Kode/Perintah Berbahaya (Injection / XSS)',
        'Akses dari Jaringan Anonim/Berisiko (Proxy / VPN Mencurigakan)',
        'Penggunaan Bot atau Alat Otomatis (Web Scraping / Automation)',
        'Pemindaian Celah Keamanan (Port / Vulnerability Scanning)',
        'Pengiriman Pesan/Data Massal (Spamming)',
        'Reputasi IP Buruk (Global Cyber Threat List)',
        'Pemblokiran Manual oleh Pengelola Sistem (Kebijakan Internal)',
        'Lainnya...'
    ],
];
