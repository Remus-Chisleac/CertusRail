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
        Schema::table('train_section_wagon', function (Blueprint $table) {
            $table->dropColumn('position_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('train_section_wagon', function (Blueprint $table) {
            $table->integer('position_order')->after('wagon_id');
        });
    }
};
