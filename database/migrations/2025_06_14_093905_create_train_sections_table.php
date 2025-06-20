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
        Schema::create('train_sections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // allows tracking splits (parent → child)
            $table->foreignId('parent_section_id')
                  ->nullable()
                  ->constrained('train_sections')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('train_sections');
    }
};
