<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Train extends Model
{
    protected $fillable = ['name', 'latitude', 'longitude'];


    /**
     * All power trains (sets of locomotives) for this train.
     */
    public function powerTrains(): HasMany
    {
        return $this->hasMany(PowerTrain::class);
    }

    /**
     * All train sections (sets of wagons) for this train.
     * Renamed from sections() for clarity.
     */
    public function trainSections(): HasMany
    {
        return $this->hasMany(TrainSection::class);
    }

    /**
     * The schedule stops for this train.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(TrainSchedule::class);
    }

    /**
     * Defines a relationship to the locomotive pivot models for efficient counting.
     * This allows using `withCount('locomotives')`.
     * NOTE: Accessing `$train->locomotives` will return a collection of `PowerTrainLocomotive` pivot models, NOT `Locomotive` models.
     */
    public function locomotives(): HasManyThrough
    {
        return $this->hasManyThrough(PowerTrainLocomotive::class, PowerTrain::class);
    }

    /**
     * Defines a relationship to the wagon pivot models for efficient counting.
     * This allows using `withCount('wagons')`.
     * NOTE: Accessing `$train->wagons` will return a collection of `TrainSectionWagon` pivot models, NOT `Wagon` models.
     */
    public function wagons(): HasManyThrough
    {
        return $this->hasManyThrough(TrainSectionWagon::class, TrainSection::class);
    }
}
