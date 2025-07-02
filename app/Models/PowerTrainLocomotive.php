<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PowerTrainLocomotive extends Model
{
    protected $table = 'power_train_locomotive';
    protected $fillable = ['power_train_id', 'locomotive_id'];

    /**
     * The power train this locomotive belongs to.
     */
    public function powerTrain()
    {
        return $this->belongsTo(PowerTrain::class, 'power_train_id');
    }

    /**
     * The locomotive in this power train.
     */
    public function locomotive()
    {
        return $this->belongsTo(Locomotive::class, 'locomotive_id');
    }
}
