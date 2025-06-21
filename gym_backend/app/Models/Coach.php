<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    use HasFactory;

    protected $table = 'coachs';
    
    // Disable Laravel's automatic timestamps
    public $timestamps = false;
    
    protected $fillable = [
        'utilisateur_id',
        'specialite',
        'experience'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function cours()
    {
        return $this->hasMany(Cours::class, 'coach_id');
    }
}
