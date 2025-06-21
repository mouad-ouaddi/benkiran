<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use HasFactory;

    protected $table = 'abonnements';
    public $timestamps = false;

    
    protected $fillable = [
        'nom',
        'prix',
        'duree',
        'description'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'duree' => 'integer'
    ];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'abonnement_id');
    }
}
