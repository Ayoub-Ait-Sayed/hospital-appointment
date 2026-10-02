<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'message',
        'reference_id',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
    ];

    // Notification appartient à un utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
