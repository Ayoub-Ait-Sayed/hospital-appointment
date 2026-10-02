<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\Specialite;
use App\Models\RendezVous;

class AdminController extends Controller
{
    /**
     * ==========================================
     * Liste des médecins en attente
     * ==========================================
     */
    public function demandesMedecins()
    {
        $medecins = Medecin::with([
            'user',
            'specialite'
        ])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'medecins' => $medecins,
            'nombre' => $medecins->count(),
        ]);
    }


    /**
     * ==========================================
     * Accepter un médecin
     * ==========================================
     */
    public function accepterMedecin($id)
    {
        $medecin = Medecin::find($id);

        if (!$medecin) {
            return response()->json([
                'message' => 'Médecin introuvable.'
            ], 404);
        }

        if ($medecin->status !== 'pending') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée.'
            ], 422);
        }

        $medecin->update([
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Médecin accepté avec succès.',
            'medecin' => $medecin->fresh()->load([
                'user',
                'specialite'
            ])
        ]);
    }


    /**
     * ==========================================
     * Refuser un médecin
     * ==========================================
     */
    public function refuserMedecin($id)
    {
        $medecin = Medecin::find($id);

        if (!$medecin) {
            return response()->json([
                'message' => 'Médecin introuvable.'
            ], 404);
        }

        if ($medecin->status !== 'pending') {
            return response()->json([
                'message' => 'Cette demande a déjà été traitée.'
            ], 422);
        }

        $medecin->update([
            'status' => 'refuse'
        ]);

        return response()->json([
            'message' => 'Médecin refusé avec succès.',
            'medecin' => $medecin->fresh()->load([
                'user',
                'specialite'
            ])
        ]);
    }


    /**
     * ==========================================
     * Réactiver un médecin refusé
     * ==========================================
     */
    public function reactiverMedecin($id)
    {
        $medecin = Medecin::find($id);

        if (!$medecin) {
            return response()->json([
                'message' => 'Médecin introuvable.'
            ], 404);
        }

        $medecin->update([
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Médecin remis en attente.',
            'medecin' => $medecin->load([
                'user',
                'specialite'
            ])
        ]);
    }


    /**
     * ==========================================
     * Dashboard Admin
     * ==========================================
     */
    public function dashboard()
    {
        return response()->json([
            'message' => 'Dashboard Admin',

            'statistiques' => [
                'medecins' => Medecin::where('status', 'active')->count(),

                'medecins_en_attente' => Medecin::where(
                    'status',
                    'pending'
                )->count(),

                'patients' => Patient::count(),

                'responsables' => User::where(
                    'role',
                    'responsable'
                )->count(),

                'specialites' => Specialite::count(),

                'rendez_vous' => RendezVous::count(),

                'rendez_vous_en_attente' => RendezVous::where(
                    'statut',
                    'en_attente'
                )->count(),

                'rendez_vous_confirmes' => RendezVous::where(
                    'statut',
                    'confirme'
                )->count(),

                'rendez_vous_annules' => RendezVous::where(
                    'statut',
                    'annule'
                )->count(),

                'rendez_vous_termines' => RendezVous::where(
                    'statut',
                    'termine'
                )->count(),
            ],
        ]);
    }
}
