<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TrainSection extends Model
{
    protected $fillable = ['train_id', 'name'];

    /**
     * The train this section belongs to.
     */
    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    /**
     * The wagons in this section via pivot.
     */
    public function wagons(): BelongsToMany
    {
        return $this->belongsToMany(
            Wagon::class,
            'train_section_wagon',
            'train_section_id',
            'wagon_id'
        )->withPivot('position_order')->withTimestamps();
    }
}
