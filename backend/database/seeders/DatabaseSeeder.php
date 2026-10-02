<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Medecin;
use App\Models\Specialite;
use App\Models\Disponibilite;
use App\Models\RendezVous;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | SPECIALITES
        |--------------------------------------------------------------------------
        */

        $cardiologie = Specialite::create([
            'nom' => 'Cardiologie',
            'description' => 'Spécialité médicale du cœur et du système cardiovasculaire.',
        ]);

        $dermatologie = Specialite::create([
            'nom' => 'Dermatologie',
            'description' => 'Spécialité consacrée aux maladies de la peau.',
        ]);

        $generaliste = Specialite::create([
            'nom' => 'Médecine générale',
            'description' => 'Consultations médicales générales.',
        ]);


        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */

        User::create([
            'name' => 'Admin',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);


        /*
        |--------------------------------------------------------------------------
        | RESPONSABLE
        |--------------------------------------------------------------------------
        */

        User::create([
            'name' => 'Responsable Hospital',
            'email' => 'responsable@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'responsable',
        ]);


        /*
        |--------------------------------------------------------------------------
        | MEDECIN 1
        |--------------------------------------------------------------------------
        */

        $userMedecin1 = User::create([
            'name' => 'Dr. Ahmed Alaoui',
            'email' => 'ahmed@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'medecin',
        ]);

        $medecin1 = Medecin::create([
            'user_id' => $userMedecin1->id,
            'specialite_id' => $cardiologie->id,
            'telephone' => '0612345678',
            'description' => 'Médecin spécialiste en cardiologie.',
        ]);


        /*
        |--------------------------------------------------------------------------
        | MEDECIN 2
        |--------------------------------------------------------------------------
        */

        $userMedecin2 = User::create([
            'name' => 'Dr. Sara Amrani',
            'email' => 'sara@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'medecin',
        ]);

        $medecin2 = Medecin::create([
            'user_id' => $userMedecin2->id,
            'specialite_id' => $dermatologie->id,
            'telephone' => '0623456789',
            'description' => 'Médecin spécialiste en dermatologie.',
        ]);


        /*
        |--------------------------------------------------------------------------
        | MEDECIN 3
        |--------------------------------------------------------------------------
        */

        $userMedecin3 = User::create([
            'name' => 'Dr. Youssef Bennani',
            'email' => 'youssef@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'medecin',
        ]);

        $medecin3 = Medecin::create([
            'user_id' => $userMedecin3->id,
            'specialite_id' => $generaliste->id,
            'telephone' => '0634567890',
            'description' => 'Médecin généraliste.',
        ]);


        /*
        |--------------------------------------------------------------------------
        | PATIENT 1
        |--------------------------------------------------------------------------
        */

        $userPatient1 = User::create([
            'name' => 'Ayoub Patient',
            'email' => 'patient@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
        ]);

        $patient1 = Patient::create([
            'user_id' => $userPatient1->id,
            'telephone' => '0645678901',
            'date_naissance' => '2000-05-15',
            'adresse' => 'Agadir, Maroc',
        ]);


        /*
        |--------------------------------------------------------------------------
        | PATIENT 2
        |--------------------------------------------------------------------------
        */

        $userPatient2 = User::create([
            'name' => 'Fatima Zahra',
            'email' => 'fatima@hospital.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
        ]);

        $patient2 = Patient::create([
            'user_id' => $userPatient2->id,
            'telephone' => '0656789012',
            'date_naissance' => '1998-09-20',
            'adresse' => 'Agadir, Maroc',
        ]);


        /*
        |--------------------------------------------------------------------------
        | CRENEAUX
        |--------------------------------------------------------------------------
        |
        | Chaque rendez-vous dure 20 minutes.
        |
        | Matin :
        | 08:40 -> 13:00 = 13 créneaux
        |
        | Après-midi :
        | 14:40 -> 17:20 = 8 créneaux
        |
        | Total : 21 créneaux par jour.
        |
        */

        $morningSlots = [
            ['08:40', '09:00'],
            ['09:00', '09:20'],
            ['09:20', '09:40'],
            ['09:40', '10:00'],
            ['10:00', '10:20'],
            ['10:20', '10:40'],
            ['10:40', '11:00'],
            ['11:00', '11:20'],
            ['11:20', '11:40'],
            ['11:40', '12:00'],
            ['12:00', '12:20'],
            ['12:20', '12:40'],
            ['12:40', '13:00'],
        ];

        $afternoonSlots = [
            ['14:40', '15:00'],
            ['15:00', '15:20'],
            ['15:20', '15:40'],
            ['15:40', '16:00'],
            ['16:00', '16:20'],
            ['16:20', '16:40'],
            ['16:40', '17:00'],
            ['17:00', '17:20'],
        ];

        $slots = array_merge(
            $morningSlots,
            $afternoonSlots
        );


        /*
        |--------------------------------------------------------------------------
        | LUNDI -> VENDREDI
        |--------------------------------------------------------------------------
        */

        $startDate = Carbon::now()->next(Carbon::MONDAY);

        $medecins = [
            $medecin1,
            $medecin2,
            $medecin3,
        ];

        for ($day = 0; $day < 5; $day++) {

            $currentDate = $startDate->copy()->addDays($day);

            foreach ($medecins as $medecin) {

                foreach ($slots as $slot) {

                    Disponibilite::create([
                        'medecin_id' => $medecin->id,
                        'date' => $currentDate->format('Y-m-d'),
                        'heure_debut' => $slot[0],
                        'heure_fin' => $slot[1],
                    ]);
                }
            }
        }


        /*
        |--------------------------------------------------------------------------
        | RENDEZ-VOUS DE TEST
        |--------------------------------------------------------------------------
        */

        RendezVous::create([
            'patient_id' => $patient2->id,
            'medecin_id' => $medecin1->id,
            'date' => $startDate->format('Y-m-d'),
            'heure' => '08:40',
            'statut' => 'confirme',
        ]);

        RendezVous::create([
            'patient_id' => $patient2->id,
            'medecin_id' => $medecin2->id,
            'date' => $startDate->format('Y-m-d'),
            'heure' => '09:00',
            'statut' => 'en_attente',
        ]);
    }
}