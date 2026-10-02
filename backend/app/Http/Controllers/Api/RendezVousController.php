<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use App\Models\Disponibilite;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RendezVousController extends Controller
{
    /**
     * Patient : créer un rendez-vous
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medecin_id' => 'required|exists:medecins,id',
            'date' => 'required|date',
            'heure' => 'required|date_format:H:i',
        ]);

        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Profil patient introuvable'
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier la date
        |--------------------------------------------------------------------------
        */

        $date = Carbon::parse($validated['date']);
        $aujourdHui = Carbon::today();

        if ($date->lte($aujourdHui)) {
            return response()->json([
                'message' => 'Vous devez choisir une date à partir de demain.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier disponibilité
        |--------------------------------------------------------------------------
        */

        $disponibilite = Disponibilite::where(
            'medecin_id',
            $validated['medecin_id']
        )
            ->where(
                'date',
                $validated['date']
            )
            ->where(
                'heure_debut',
                '<=',
                $validated['heure']
            )
            ->where(
                'heure_fin',
                '>',
                $validated['heure']
            )
            ->first();

        if (!$disponibilite) {
            return response()->json([
                'message' => 'Le médecin n’est pas disponible à cette date et cette heure.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier créneau de 20 minutes
        |--------------------------------------------------------------------------
        */

        $heureChoisie = Carbon::createFromFormat(
            'H:i',
            $validated['heure']
        );

        $heureDebut = Carbon::createFromFormat(
            'H:i:s',
            $disponibilite->heure_debut
        );

        $minutes = $heureDebut->diffInMinutes(
            $heureChoisie
        );

        if ($minutes % 20 !== 0) {
            return response()->json([
                'message' => 'Cette heure ne correspond pas à un créneau de 20 minutes.'
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Vérifier créneau déjà réservé
        |--------------------------------------------------------------------------
        */

        $existe = RendezVous::where(
            'medecin_id',
            $validated['medecin_id']
        )
            ->where(
                'date',
                $validated['date']
            )
            ->where(
                'heure',
                $validated['heure']
            )
            ->whereIn(
                'statut',
                ['en_attente', 'confirme']
            )
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ce créneau est déjà réservé.'
            ], 409);
        }

        /*
        |--------------------------------------------------------------------------
        | Créer rendez-vous
        |--------------------------------------------------------------------------
        */

        $rendezVous = RendezVous::create([
            'patient_id' => $patient->id,
            'medecin_id' => $validated['medecin_id'],
            'date' => $validated['date'],
            'heure' => $validated['heure'],
            'statut' => 'en_attente',
        ]);

        $medecin = $rendezVous->medecin()->with('user')->first();

        if ($medecin && $medecin->user) {
            Notification::create([
                'user_id' => $medecin->user->id,
                'type' => 'nouveau_rendez_vous',
                'message' => 'Vous avez un nouveau rendez-vous.',
                'reference_id' => $rendezVous->id,
                'read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'rendez_vous' => $rendezVous->load([
                'medecin.user',
                'medecin.specialite'
            ])
        ], 201);
    }


    /**
     * Patient : voir ses rendez-vous
     */
    public function index(Request $request)
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Profil patient introuvable'
            ], 404);
        }

        $rendezVous = RendezVous::where(
            'patient_id',
            $patient->id
        )
            ->with([
                'medecin.user',
                'medecin.specialite'
            ])
            ->orderBy('date')
            ->orderBy('heure')
            ->get();

        return response()->json([
            'rendez_vous' => $rendezVous
        ]);
    }


    /**
     * Patient : annuler rendez-vous
     */
    public function destroy(Request $request, $id)
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Profil patient introuvable'
            ], 404);
        }

        $rendezVous = RendezVous::where('id', $id)
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if ($rendezVous->statut === 'termine') {
            return response()->json([
                'message' => 'Un rendez-vous terminé ne peut pas être annulé.'
            ], 422);
        }

        $rendezVous->update([
            'statut' => 'annule',
        ]);

        return response()->json([
            'message' => 'Rendez-vous annulé avec succès'
        ]);
    }


    /**
     * Médecin : voir ses rendez-vous
     */
    public function medecinRendezVous(Request $request)
    {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable'
            ], 404);
        }

        $rendezVous = RendezVous::where(
            'medecin_id',
            $medecin->id
        )
            ->with([
                'patient.user'
            ])
            ->orderBy('date')
            ->orderBy('heure')
            ->get();

        return response()->json([
            'rendez_vous' => $rendezVous
        ]);
    }


    /**
     * Médecin : confirmer
     */
    public function confirmer(Request $request, $id)
    {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable'
            ], 404);
        }

        $rendezVous = RendezVous::where('id', $id)
            ->where('medecin_id', $medecin->id)
            ->firstOrFail();

        if ($rendezVous->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut pas être confirmé.'
            ], 422);
        }

        $rendezVous->update([
            'statut' => 'confirme',
        ]);

        return response()->json([
            'message' => 'Rendez-vous confirmé avec succès',
            'rendez_vous' => $rendezVous
        ]);
    }


    /**
     * Médecin : annuler
     */
    public function annulerParMedecin(Request $request, $id)
    {
        $medecin = $request->user()->medecin;

        if (!$medecin) {
            return response()->json([
                'message' => 'Profil médecin introuvable'
            ], 404);
        }

        $rendezVous = RendezVous::where('id', $id)
            ->where('medecin_id', $medecin->id)
            ->firstOrFail();

        if ($rendezVous->statut === 'termine') {
            return response()->json([
                'message' => 'Un rendez-vous terminé ne peut pas être annulé.'
            ], 422);
        }

        $rendezVous->update([
            'statut' => 'annule',
        ]);

        return response()->json([
            'message' => 'Rendez-vous annulé avec succès',
            'rendez_vous' => $rendezVous
        ]);
    }
}

