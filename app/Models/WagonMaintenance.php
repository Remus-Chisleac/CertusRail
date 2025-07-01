<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WagonMaintenance extends Model
{
    protected $table = 'wagon_maintenance';
    protected $fillable = ['wagon_id', 'maintenance_date', 'type', 'notes'];

    /**
     * Each maintenance record belongs to one wagon.
     */
    public function wagon(): BelongsTo
    {
        return $this->belongsTo(Wagon::class);
    }
}
