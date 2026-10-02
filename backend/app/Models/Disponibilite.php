<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disponibilite extends Model
{
    protected $fillable = [
        'medecin_id',
        'date',
        'heure_debut',
        'heure_fin',
    ];

    // La disponibilité appartient à un médecin
    public function medecin(): BelongsTo
    {
        return $this->belongsTo(Medecin::class);
    }
}

