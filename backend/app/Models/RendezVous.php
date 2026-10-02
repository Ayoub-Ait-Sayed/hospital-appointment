<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RendezVous extends Model
{
    protected $fillable = [
        'patient_id',
        'medecin_id',
        'date',
        'heure',
        'statut',
    ];

    // Le rendez-vous appartient à un patient
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    // Le rendez-vous appartient à un médecin
    public function medecin(): BelongsTo
    {
        return $this->belongsTo(Medecin::class);
    }
}

