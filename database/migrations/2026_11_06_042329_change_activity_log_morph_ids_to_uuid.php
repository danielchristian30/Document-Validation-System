
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus kolom BIGINT lama.
        // Index yang bergantung pada kolom tersebut
        // akan ikut dihapus oleh PostgreSQL.
        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropColumn([
                'subject_id',
                'causer_id',
            ]);
        });

        // Buat ulang kedua kolom menggunakan UUID.
        Schema::table('activity_log', function (Blueprint $table) {
            $table->uuid('subject_id')->nullable();
            $table->uuid('causer_id')->nullable();

            // Index untuk relasi polymorphic.
            $table->index(
                ['subject_type', 'subject_id'],
                'activity_log_subject_type_subject_id_index'
            );

            $table->index(
                ['causer_type', 'causer_id'],
                'activity_log_causer_type_causer_id_index'
            );
        });
    }

    public function down(): void
    {
        // Hapus index UUID.
        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropIndex(
                'activity_log_subject_type_subject_id_index'
            );

            $table->dropIndex(
                'activity_log_causer_type_causer_id_index'
            );

            $table->dropColumn([
                'subject_id',
                'causer_id',
            ]);
        });

        // Kembalikan ke BIGINT sesuai migration awal.
        Schema::table('activity_log', function (Blueprint $table) {
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->unsignedBigInteger('causer_id')->nullable();

            $table->index(
                ['subject_type', 'subject_id'],
                'subject'
            );

            $table->index(
                ['causer_type', 'causer_id'],
                'causer'
            );
        });
    }
};
