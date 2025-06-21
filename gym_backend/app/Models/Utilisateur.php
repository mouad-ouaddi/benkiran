<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Utilisateur extends Authenticatable
{
    use HasFactory;

    protected $table = 'utilisateurs';
    
    // Disable Laravel's automatic timestamps
    public $timestamps = false;
    
    protected $fillable = [
        'nom',
        'prenom', 
        'email',
        'mot_de_passe',
        'role',
        'date_creation'
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    // Override the password field for Laravel auth
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    // Relationships
    public function adherent()
    {
        return $this->hasOne(Adherent::class, 'utilisateur_id');
    }

    public function coach()
    {
        return $this->hasOne(Coach::class, 'utilisateur_id');
    }
}
