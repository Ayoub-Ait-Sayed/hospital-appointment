<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialite extends Model
{
    protected $fillable = [
        'nom',
        'description',
    ];

    // Une spécialité possède plusieurs médecins
    public function medecins(): HasMany
    {
        return $this->hasMany(Medecin::class);
    }
}

