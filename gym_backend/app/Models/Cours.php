<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';
    
    protected $fillable = [
        'nom',
        'description',
        'type',
        'coach_id'
    ];

    public function coach()
    {
        return $this->belongsTo(Coach::class, 'coach_id');
    }

    public function plannings()
    {
        return $this->hasMany(Planning::class, 'cours_id');
    }
}
