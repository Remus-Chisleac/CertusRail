<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Station extends Model
{
    protected $fillable = ['name', 'code', 'latitude', 'longitude', 'description'];

    /**
     * All outgoing connections from this station.
     */
    public function connections(): HasMany
    {
        return $this->hasMany(StationConnection::class);
    }

    /**
     * All incoming connections to this station.
     */
    public function connectedFrom(): HasMany
    {
        return $this->hasMany(
            StationConnection::class,
            'connected_station_id'
        );
    }
}
