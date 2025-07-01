<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Locomotive extends Model
{
    protected $fillable = ['code', 'model', 'manufacturer', 'built_year'];

    /**
     * A Locomotives can have many maintenance records.
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(LocomotiveMaintenance::class);
    }

    /**
     * A Locomotives may belong to multiple PowerTrains via pivot.
     */
    public function powerTrains(): BelongsToMany
    {
        return $this->belongsToMany(
            PowerTrain::class,
            'power_train_locomotive',
            'locomotive_id',
            'power_train_id'
        )->withPivot('position_order')->withTimestamps();
    }
}
