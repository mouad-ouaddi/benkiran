<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    use HasFactory;

    protected $table = 'plannings';
      protected $fillable = [
        'date_heure',
        'duree',
        'capacite'
    ];

    protected $casts = [
        'date_heure' => 'datetime',
        'duree' => 'integer',
        'capacite' => 'integer'
    ];    public function cours()
    {
        return $this->hasOne(Cours::class, 'planning_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'planning_id');
    }
}
