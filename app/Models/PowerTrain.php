<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PowerTrain extends Model
{
    protected $fillable = ['train_id', 'name'];

    /**
     * The train this power set belongs to.
     */
    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    /**
     * The locomotives in this power train via pivot.
     */
    public function locomotives(): BelongsToMany
    {
        return $this->belongsToMany(
            Locomotive::class,
            'power_train_locomotive',
            'power_train_id',
            'locomotive_id'
        )->withTimestamps();
    }
}
