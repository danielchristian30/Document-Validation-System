<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::create([
        //     'name' => 'Super Administrator',
        //     'username' => 'superadmin',
        //     'email' => 'superadmin@denpasarkota.com',
        //     'password' => 'SatuDataDenpasar',
        //     'role' => 'superadmin',
        //     'is_active' => True,
        // ]);

        User::create([
            'name' => 'Mario',
            'username' => 'mariogebuh',
            'email' => 'mario@denpasarkota.com',
            'password' => 'Mario123',
            'role' => 'employee',
            'bidang' => 'persandian',
            'is_active' => True,
        ]);

        User::create([
            'name' => 'Tina Kristini',
            'username' => 'tinakristini',
            'email' => 'tina@denpasarkota.com',
            'password' => 'password',
            'role' => 'employee',
            'bidang' => 'statistik',
            'is_active' => True,
        ]);

        User::create([
            'name' => 'Dewa Rama',
            'username' => 'dewarama',
            'email' => 'dewarama@denpasarkota.com',
            'password' => 'admin',
            'role' => 'admin',
            'bidang' => 'statistik',
            'is_active' => True,
        ]);
    }
}
