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
        Schema::create('train_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('train_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('station_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->dateTime('departure_datetime')->nullable();
            $table->dateTime('arrival_datetime')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('train_schedules');
    }
};
