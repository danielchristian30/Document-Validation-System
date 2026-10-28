<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('blocked_ips', function (Blueprint $table) {
            $table->string('source')->default('manual')->after('reason');
            $table->timestamp('expired_at')->nullable()->after('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blocked_ips', function (Blueprint $table) {
            $table->dropColumn(['source', 'expired_at']);
        });
    }
};
