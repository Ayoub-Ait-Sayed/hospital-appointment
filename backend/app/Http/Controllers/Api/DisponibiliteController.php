<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Disponibilite;
use App\Models\Medecin;
use Carbon\Carbon;

class DisponibiliteController extends Controller
{
    public function byMedecin($medecinId)
    {
        $medecin = Medecin::with([
            'user',
            'specialite'
        ])->find($medecinId);

        if (!$medecin) {
            return response()->json([
                'message' => 'Médecin introuvable'
            ], 404);
        }

        $aujourdHui = Carbon::today();

        /*
        |--------------------------------------------------------------------------
        | Générer les disponibilités par défaut
        |--------------------------------------------------------------------------
        |
        | Lundi -> Vendredi
        | 08:40 -> 13:00
        | 14:40 -> 17:20
        |
        | Samedi et dimanche = repos par défaut.
        |
        */

        for ($i = 1; $i <= 14; $i++) {

            $date = $aujourdHui->copy()->addDays($i);

            // 0 = dimanche
            // 6 = samedi
            $jourSemaine = $date->dayOfWeek;

            // Pas de disponibilité automatique samedi/dimanche
            if ($jourSemaine === Carbon::SATURDAY ||
                $jourSemaine === Carbon::SUNDAY) {
                continue;
            }

            // MATIN
            Disponibilite::firstOrCreate(
                [
                    'medecin_id' => $medecinId,
                    'date' => $date->toDateString(),
                    'heure_debut' => '08:40:00',
                    'heure_fin' => '13:00:00',
                ]
            );

            // APRÈS-MIDI
            Disponibilite::firstOrCreate(
                [
                    'medecin_id' => $medecinId,
                    'date' => $date->toDateString(),
                    'heure_debut' => '14:40:00',
                    'heure_fin' => '17:20:00',
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Récupérer uniquement les disponibilités futures
        |--------------------------------------------------------------------------
        */

        $disponibilites = Disponibilite::where(
            'medecin_id',
            $medecinId
        )
            ->where(
                'date',
                '>',
                $aujourdHui->toDateString()
            )
            ->orderBy('date')
            ->orderBy('heure_debut')
            ->get();

        return response()->json([
            'medecin' => $medecin,
            'date_aujourd_hui' => $aujourdHui->toDateString(),
            'disponibilites' => $disponibilites
        ]);
    }
}

