<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Wagon extends Model
{
    protected $fillable = ['code', 'type', 'capacity'];

    /**
     * A Wagon can have many maintenance records.
     */
    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(WagonMaintenance::class);
    }

    /**
     * A Wagon may belong to multiple TrainSections via pivot.
     */
    public function trainSections(): BelongsToMany
    {
        return $this->belongsToMany(
            TrainSection::class,
            'train_section_wagon',
            'wagon_id',
            'train_section_id'
        )->withPivot('position_order')->withTimestamps();
    }
}
