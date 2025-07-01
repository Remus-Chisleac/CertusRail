<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TrainSectionWagon extends Pivot
{
    protected $table = 'train_section_wagon';
    protected $fillable = ['train_section_id', 'wagon_id', 'position_order'];
}
