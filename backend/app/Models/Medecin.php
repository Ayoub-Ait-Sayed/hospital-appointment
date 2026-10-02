<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    protected $fillable = [
        'user_id',
        'specialite_id',
        'telephone',
        'image',
        'description',
        'status',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function specialite()
    {
        return $this->belongsTo(Specialite::class);
    }


    public function disponibilites()
    {
        return $this->hasMany(Disponibilite::class);
    }


    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}