<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Train extends Model
{
    protected $fillable = ['name', 'initial_section_id', 'initial_power_train_id'];

    /**
     * The initial wagon section.
     */
    public function initialSection(): BelongsTo
    {
        return $this->belongsTo(TrainSection::class, 'initial_section_id');
    }

    /**
     * All sections for this train.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(TrainSection::class);
    }

    /**
     * The initial power train.
     */
    public function initialPowerTrain(): BelongsTo
    {
        return $this->belongsTo(PowerTrain::class, 'initial_power_train_id');
    }

    /**
     * All power trains (sets of locomotives) for this train.
     */
    public function powerTrains(): HasMany
    {
        return $this->hasMany(PowerTrain::class);
    }

    /**
     * The schedule stops for this train.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(TrainSchedule::class);
    }
}
