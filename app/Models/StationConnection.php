<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StationConnection extends Model
{
    protected $fillable = [
        'station_id',
        'connected_station_id',
        'distance_km',
        'travel_time_minutes',
        'track_type'
    ];

    /**
     * The “from” station.
     */
    public function station(): BelongsTo
    {
        return $this->belongsTo(Station::class);
    }

    /**
     * The adjacent “to” station.
     */
    public function connectedStation(): BelongsTo
    {
        return $this->belongsTo(
            Station::class,
            'connected_station_id'
        );
    }
}
