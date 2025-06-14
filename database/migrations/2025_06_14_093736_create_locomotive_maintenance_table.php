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
        Schema::create('locomotive_maintenance', function (Blueprint $table) {
             $table->id();
            $table->foreignId('locomotive_id')
                    ->nullable()
                    ->constrained()
                    ->nullOnDelete();
            $table->date('maintenance_date');
            $table->string('type');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locomotive_maintenance');
    }
};
