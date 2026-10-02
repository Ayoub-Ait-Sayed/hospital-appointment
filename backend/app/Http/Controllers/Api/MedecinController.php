<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medecin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MedecinController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | TOUS LES MEDECINS
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $medecins = Medecin::with([
            'user',
            'specialite'
        ])->get();

        return response()->json([
            'medecins' => $medecins
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | MEDECINS PAR SPECIALITE
    |--------------------------------------------------------------------------
    */

    public function bySpecialite($specialiteId)
    {
        $medecins = Medecin::where(
            'specialite_id',
            $specialiteId
        )
        ->where('status', 'active')
        ->with([
            'user',
            'specialite'
        ])
        ->get();

        return response()->json([
            'medecins' => $medecins
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | PROFILE MEDECIN
    |--------------------------------------------------------------------------
    */

    public function profile(Request $request)
    {
        $user = $request->user();

        $medecin = Medecin::with([
            'user',
            'specialite'
        ])
        ->where('user_id', $user->id)
        ->first();

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }

        return response()->json([
            'medecin' => $medecin
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | AJOUTER / MODIFIER PHOTO
    |--------------------------------------------------------------------------
    */

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ]);

        $user = $request->user();

        $medecin = Medecin::where(
            'user_id',
            $user->id
        )->first();

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }

        // Supprimer ancienne image
        if ($medecin->image) {
            Storage::disk('public')->delete(
                $medecin->image
            );
        }

        // Enregistrer nouvelle image
        $path = $request
            ->file('image')
            ->store('medecins', 'public');

        // Sauvegarder chemin dans DB
        $medecin->image = $path;

        $medecin->save();

        // Recharger relations
        $medecin->load([
            'user',
            'specialite'
        ]);

        return response()->json([
            'message' => 'Photo ajoutée avec succès.',
            'medecin' => $medecin
        ]);
    }
}
