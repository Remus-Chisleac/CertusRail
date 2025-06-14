<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('power_train_locomotive', function (Blueprint $table) {
            $table->foreignId('power_train_id')
                  ->constrained('power_trains')
                  ->cascadeOnDelete();
            $table->foreignId('locomotive_id')
                  ->constrained('locomotives')
                  ->cascadeOnDelete();
            $table->integer('position_order');
            $table->primary(['power_train_id', 'locomotive_id'], 'ptl_primary');
        });
    }

    public function down()
    {
        Schema::dropIfExists('power_train_locomotive');
    }
};
