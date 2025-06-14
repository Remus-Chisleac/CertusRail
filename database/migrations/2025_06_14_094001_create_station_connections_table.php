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
        Schema::create('station_connections', function (Blueprint $table) {
            $table->id();
            // the “from” station
            $table->foreignId('station_id')
                  ->constrained('stations')
                  ->cascadeOnDelete();
            // the adjacent “to” station
            $table->foreignId('connected_station_id')
                  ->constrained('stations')
                  ->cascadeOnDelete();
            // optional extra metadata
            $table->decimal('distance_km', 8, 3)->nullable();
            $table->integer('travel_time_minutes')->nullable();
            $table->string('track_type')->nullable();
            $table->timestamps();

            // prevent duplicate or reversed entries
            $table->unique(['station_id', 'connected_station_id'], 'station_connection_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('station_connections');
    }
};
