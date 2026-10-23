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
        User::create([
            'name' => 'Super Administrator',
            'username' => 'superadmin',
            'email' => 'superadmin@denpasarkota.com',
            'password' => 'SatuDataDenpasar',
            'role' => 'superadmin',
            'is_active' => True,

            'name' => 'Mario',
            'username' => 'mariogebuh',
            'email' => 'mario@denpasarkota.com',
            'password' => 'Mario123',
            'role' => 'employee',
            'is_active' => True,
        ]);
    }
}
