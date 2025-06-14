<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('train_sections', function (Blueprint $table) {
            // add the foreign key to trains
            $table->foreignId('train_id')
                  ->after('id')
                  ->constrained()
                  ->cascadeOnDelete();

            // drop the old parent pointer
            $table->dropForeign(['parent_section_id']);
            $table->dropColumn('parent_section_id');
        });
    }

    public function down()
    {
        Schema::table('train_sections', function (Blueprint $table) {
            // restore parent pointer
            $table->foreignId('parent_section_id')
                  ->nullable()
                  ->constrained('train_sections')
                  ->nullOnDelete()
                  ->after('name');

            // drop train_id
            $table->dropForeign(['train_id']);
            $table->dropColumn('train_id');
        });
    }
};
