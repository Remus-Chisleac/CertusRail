<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainSchedule extends Model
{
    protected $table = 'train_schedules';
    protected $fillable = [
        'train_id',
        'station_id',
        'departure_datetime',
        'arrival_datetime'
    ];

    /**
     * The train for this schedule entry.
     */
    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    /**
     * The station for this schedule entry.
     */
    public function station(): BelongsTo
    {
        return $this->belongsTo(Station::class);
    }
}
