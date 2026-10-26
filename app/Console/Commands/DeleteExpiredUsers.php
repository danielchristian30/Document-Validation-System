<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class DeleteExpiredUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghapus akun yang nonaktif selama 90 hari atau lebih';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $deleted = User::where('role', '!=', 'superadmin')
            ->where('is_active', false)
            ->whereNotNull('deactivated_at')
            ->where('deactivated_at', '<=', now()->subDays(90))
            ->delete();

        $this->info("Jumlah akun yang dihapus: {$deleted}");

        return self::SUCCESS;
    }
}