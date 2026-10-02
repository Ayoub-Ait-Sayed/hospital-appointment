<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'telephone',
        'date_naissance',
        'adresse',
    ];

    // Patient appartient à User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Patient possède plusieurs rendez-vous
    public function rendezVous(): HasMany
    {
        return $this->hasMany(RendezVous::class);
    }
}

