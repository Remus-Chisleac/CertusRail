<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocomotiveMaintenance extends Model
{
    protected $table = 'locomotive_maintenance';
    protected $fillable = ['locomotive_id', 'maintenance_date', 'type', 'notes'];

    /**
     * Each maintenance record belongs to one locomotive.
     */
    public function locomotive(): BelongsTo
    {
        return $this->belongsTo(Locomotive::class);
    }
}
