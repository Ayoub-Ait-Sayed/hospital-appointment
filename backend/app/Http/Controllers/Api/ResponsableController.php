<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medecin;
use App\Models\Notification;
use App\Models\Patient;
use App\Models\RendezVous;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResponsableController extends Controller
{
    // Voir tous les médecins
    public function medecins()
    {
        $medecins = Medecin::with(['user', 'specialite'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'medecins' => $medecins
        ]);
    }


    // Voir tous les patients
    public function patients()
    {
        $patients = Patient::with('user')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'patients' => $patients
        ]);
    }


    // Voir tous les rendez-vous
    public function rendezVous()
    {
        $rendezVous = RendezVous::with([
            'patient.user',
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


    // Ajouter un médecin
    public function storeMedecin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'specialite_id' => 'required|exists:specialites,id',
            'telephone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        $result = DB::transaction(function () use ($validated) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'medecin',
            ]);

            $medecin = Medecin::create([
                'user_id' => $user->id,
                'specialite_id' => $validated['specialite_id'],
                'telephone' => $validated['telephone'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            $admins = User::where('role', 'admin')->get();

            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'nouveau_medecin',
                    'message' => 'Un nouveau médecin a été ajouté.',
                    'reference_id' => $medecin->id,
                    'read' => false,
                ]);
            }

            return $medecin->load([
                'user',
                'specialite'
            ]);
        });

        return response()->json([
            'message' => 'Médecin ajouté avec succès',
            'medecin' => $result
        ], 201);
    }


    // Modifier un médecin
    public function updateMedecin(Request $request, $id)
    {
        $medecin = Medecin::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $medecin->user_id,
            'password' => 'sometimes|nullable|string|min:8',
            'specialite_id' => 'sometimes|required|exists:specialites,id',
            'telephone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        DB::transaction(function () use ($medecin, $validated) {

            $userData = [];

            if (array_key_exists('name', $validated)) {
                $userData['name'] = $validated['name'];
            }

            if (array_key_exists('email', $validated)) {
                $userData['email'] = $validated['email'];
            }

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            if (!empty($userData)) {
                $medecin->user->update($userData);
            }

            $medecinData = [];

            if (array_key_exists('specialite_id', $validated)) {
                $medecinData['specialite_id'] = $validated['specialite_id'];
            }

            if (array_key_exists('telephone', $validated)) {
                $medecinData['telephone'] = $validated['telephone'];
            }

            if (array_key_exists('description', $validated)) {
                $medecinData['description'] = $validated['description'];
            }

            if (!empty($medecinData)) {
                $medecin->update($medecinData);
            }
        });

        return response()->json([
            'message' => 'Médecin modifié avec succès',
            'medecin' => $medecin->fresh()->load([
                'user',
                'specialite'
            ])
        ]);
    }


    // Supprimer un médecin
    public function destroyMedecin($id)
    {
        $medecin = Medecin::with('user')->findOrFail($id);

        DB::transaction(function () use ($medecin) {

            $user = $medecin->user;

            $medecin->delete();

            if ($user) {
                $user->delete();
            }
        });

        return response()->json([
            'message' => 'Médecin supprimé avec succès'
        ]);
    }


    // Voir un patient
    public function showPatient($id)
    {
        $patient = Patient::with('user')->findOrFail($id);

        return response()->json([
            'patient' => $patient
        ]);
    }


    // Supprimer un patient
    public function destroyPatient($id)
    {
        $patient = Patient::with('user')->findOrFail($id);

        DB::transaction(function () use ($patient) {

            $user = $patient->user;

            $patient->delete();

            if ($user) {
                $user->delete();
            }
        });

        return response()->json([
            'message' => 'Patient supprimé avec succès'
        ]);
    }


    // Voir un rendez-vous
    public function showRendezVous($id)
    {
        $rendezVous = RendezVous::with([
            'patient.user',
            'medecin.user',
            'medecin.specialite'
        ])->findOrFail($id);

        return response()->json([
            'rendez_vous' => $rendezVous
        ]);
    }


    // Modifier le statut d'un rendez-vous
    public function updateRendezVous(Request $request, $id)
    {
        $validated = $request->validate([
            'statut' => 'required|in:en_attente,confirme,annule,termine',
        ]);

        $rendezVous = RendezVous::findOrFail($id);

        $rendezVous->update([
            'statut' => $validated['statut'],
        ]);

        return response()->json([
            'message' => 'Statut du rendez-vous modifié avec succès',
            'rendez_vous' => $rendezVous->fresh()
        ]);
    }


    // Supprimer un rendez-vous
    public function destroyRendezVous($id)
    {
        $rendezVous = RendezVous::findOrFail($id);

        $rendezVous->delete();

        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès'
        ]);
    }
}
