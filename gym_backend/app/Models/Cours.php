<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';
    
    // Disable Laravel's automatic timestamps
    public $timestamps = false;
      protected $fillable = [
        'nom',
        'description',
        'type',
        'coach_id',
        'date_debut',
        'duree'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'duree' => 'integer'
    ];    public function coach()
    {
        return $this->belongsTo(Coach::class, 'coach_id');
    }
}
