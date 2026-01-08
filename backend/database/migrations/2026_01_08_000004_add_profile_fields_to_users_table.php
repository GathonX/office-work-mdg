<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 25)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('job_title', 100)->nullable();
            $table->string('location', 150)->nullable();
            $table->string('bio', 500)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'address', 'job_title', 'location', 'bio']);
        });
    }
};
