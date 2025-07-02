<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainSectionWagon extends Model
{
    protected $table = 'train_section_wagon';
    protected $fillable = ['train_section_id', 'wagon_id'];

    /**
     * The train section this wagon belongs to.
     */
    public function trainSection()
    {
        return $this->belongsTo(TrainSection::class, 'train_section_id');
    }

    /**
     * The wagon in this train section.
     */
    public function wagon()
    {
        return $this->belongsTo(Wagon::class, 'wagon_id');
    }
}
