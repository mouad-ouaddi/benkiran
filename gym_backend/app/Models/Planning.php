<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    use HasFactory;

    protected $table = 'plannings';
    
    protected $fillable = [
        'cours_id',
        'date_heure',
        'duree',
        'capacite'
    ];

    protected $casts = [
        'date_heure' => 'datetime',
        'duree' => 'integer',
        'capacite' => 'integer'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'planning_id');
    }
}
