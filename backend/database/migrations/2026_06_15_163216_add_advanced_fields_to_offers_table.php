<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First drop the old enum if using Postgres or modify for MySQL
        // SQLite doesn't support changing enum directly easily, but string is fine.
        Schema::table('offers', function (Blueprint $table) {
            $table->string('type')->default('offer')->after('client_id');
            $table->dateTime('viewing_date')->nullable()->after('message');
            $table->string('status')->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn(['type', 'viewing_date']);
        });
    }
};
