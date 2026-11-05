<?php

namespace App\Http\Controllers;

use App\Models\User;

abstract class Controller
{
    protected function isAuthorizedSuperadmin(?User $user): bool
    {
        if (!$user || $user->role !== 'superadmin') {
            return false;
        }

        $whitelist = config('access.superadmin_emails', []);

        if (!is_array($whitelist)) {
            return false;
        }

        $email = strtolower(trim($user->email));

        $whitelist = array_map(
            fn ($email) => strtolower(trim($email)),
            $whitelist
        );

        return in_array($email, $whitelist, true);
    }
}