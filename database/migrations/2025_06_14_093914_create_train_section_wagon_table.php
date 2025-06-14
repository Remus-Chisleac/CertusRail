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
        Schema::create('train_section_wagon', function (Blueprint $table) {
            $table->foreignId('train_section_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('wagon_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->integer('position_order');
            $table->primary(['train_section_id', 'wagon_id'], 'tsw_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('train_section_wagon');
    }
};
