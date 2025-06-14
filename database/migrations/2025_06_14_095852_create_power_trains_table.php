<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('power_trains', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            // allows tracking splits (parent → child)
            $table->foreignId('train_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('power_trains');
    }
};
