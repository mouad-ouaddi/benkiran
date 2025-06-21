<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';
    
    protected $fillable = [
        'adherent_id',
        'planning_id',
        'statut'
    ];

    protected $casts = [
        'date_reservation' => 'datetime'
    ];

    public function adherent()
    {
        return $this->belongsTo(Adherent::class, 'adherent_id');
    }

    public function planning()
    {
        return $this->belongsTo(Planning::class, 'planning_id');
    }
}
