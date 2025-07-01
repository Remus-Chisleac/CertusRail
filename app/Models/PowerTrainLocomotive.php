<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PowerTrainLocomotive extends Pivot
{
    protected $table = 'power_train_locomotive';
    protected $fillable = ['power_train_id', 'locomotive_id', 'position_order'];
}
