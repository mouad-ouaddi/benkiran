<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adherent extends Model
{
    use HasFactory;

    protected $table = 'adherents';
    
    // Disable Laravel's automatic timestamps
    public $timestamps = false;
    
    protected $fillable = [
        'utilisateur_id'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'adherent_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'adherent_id');
    }
}
