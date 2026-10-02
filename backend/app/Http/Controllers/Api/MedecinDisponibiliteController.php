<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Disponibilite;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MedecinDisponibiliteController extends Controller
{
    /**
     * Voir mes disponibilités
     */
    public function index(Request $request)
    {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }

        $disponibilites = Disponibilite::where(
            'medecin_id',
            $medecin->id
        )
            ->where(
                'date',
                '>=',
                Carbon::today()->toDateString()
            )
            ->orderBy('date')
            ->orderBy('heure_debut')
            ->get();

        return response()->json([
            'disponibilites' => $disponibilites
        ]);
    }


    /**
     * Ajouter une disponibilité
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'heure_debut' => [
                'required',
                'date_format:H:i',
            ],

            'heure_fin' => [
                'required',
                'date_format:H:i',
                'after:heure_debut',
            ],
        ], [
            'date.after_or_equal' =>
                'La date doit être aujourd’hui ou une date future.',

            'heure_fin.after' =>
                'L’heure de fin doit être après l’heure de début.',
        ]);


        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Vérifier chevauchement
        |--------------------------------------------------------------------------
        */

        $chevauchement = Disponibilite::where(
            'medecin_id',
            $medecin->id
        )
            ->where(
                'date',
                $validated['date']
            )
            ->where(function ($query) use ($validated) {

                $query
                    ->where(
                        'heure_debut',
                        '<',
                        $validated['heure_fin']
                    )
                    ->where(
                        'heure_fin',
                        '>',
                        $validated['heure_debut']
                    );
            })
            ->exists();


        if ($chevauchement) {
            return response()->json([
                'message' =>
                    'Cette disponibilité chevauche une disponibilité existante.'
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Créer
        |--------------------------------------------------------------------------
        */

        $disponibilite = Disponibilite::create([
            'medecin_id' => $medecin->id,
            'date' => $validated['date'],
            'heure_debut' => $validated['heure_debut'],
            'heure_fin' => $validated['heure_fin'],
        ]);


        return response()->json([
            'message' =>
                'Disponibilité ajoutée avec succès.',

            'disponibilite' =>
                $disponibilite
        ], 201);
    }


    /**
     * Modifier une disponibilité
     */
    public function update(
        Request $request,
        $id
    ) {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }


        $disponibilite =
            Disponibilite::where(
                'id',
                $id
            )
                ->where(
                    'medecin_id',
                    $medecin->id
                )
                ->first();


        if (!$disponibilite) {
            return response()->json([
                'message' =>
                    'Disponibilité introuvable.'
            ], 404);
        }


        $validated = $request->validate([
            'date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'heure_debut' => [
                'required',
                'date_format:H:i',
            ],

            'heure_fin' => [
                'required',
                'date_format:H:i',
                'after:heure_debut',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Vérifier chevauchement
        |--------------------------------------------------------------------------
        */

        $chevauchement = Disponibilite::where(
            'medecin_id',
            $medecin->id
        )
            ->where(
                'date',
                $validated['date']
            )
            ->where(
                'id',
                '!=',
                $id
            )
            ->where(function ($query) use ($validated) {

                $query
                    ->where(
                        'heure_debut',
                        '<',
                        $validated['heure_fin']
                    )
                    ->where(
                        'heure_fin',
                        '>',
                        $validated['heure_debut']
                    );
            })
            ->exists();


        if ($chevauchement) {
            return response()->json([
                'message' =>
                    'Cette disponibilité chevauche une autre disponibilité.'
            ], 422);
        }


        $disponibilite->update([
            'date' =>
                $validated['date'],

            'heure_debut' =>
                $validated['heure_debut'],

            'heure_fin' =>
                $validated['heure_fin'],
        ]);


        return response()->json([
            'message' =>
                'Disponibilité modifiée avec succès.',

            'disponibilite' =>
                $disponibilite
        ]);
    }


    /**
     * Supprimer une disponibilité
     */
    public function destroy(
        Request $request,
        $id
    ) {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable.'
            ], 404);
        }


        $disponibilite =
            Disponibilite::where(
                'id',
                $id
            )
                ->where(
                    'medecin_id',
                    $medecin->id
                )
                ->first();


        if (!$disponibilite) {
            return response()->json([
                'message' =>
                    'Disponibilité introuvable.'
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Vérifier les rendez-vous
        |--------------------------------------------------------------------------
        */

        $rendezVousExiste =
            $disponibilite
                ->rendezVous()
                ->whereIn(
                    'statut',
                    [
                        'en_attente',
                        'confirme'
                    ]
                )
                ->exists();


        if ($rendezVousExiste) {
            return response()->json([
                'message' =>
                    'Impossible de supprimer cette disponibilité car elle contient un rendez-vous.'
            ], 422);
        }


        $disponibilite->delete();


        return response()->json([
            'message' =>
                'Disponibilité supprimée avec succès.'
        ]);
    }
}

