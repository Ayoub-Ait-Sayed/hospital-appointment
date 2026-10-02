<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\ResponsableController;
use App\Http\Controllers\Api\RendezVousController;
use App\Models\Disponibilite;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\Specialite;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_admin_notification_when_a_doctor_is_added(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $specialite = Specialite::create([
            'nom' => 'Cardiologie',
            'description' => 'Cardiologie',
        ]);

        $request = Request::create('/responsable/medecins', 'POST', [
            'name' => 'Dr. Test',
            'email' => 'doctor.notification@test.com',
            'password' => 'password123',
            'specialite_id' => $specialite->id,
            'telephone' => '0611223344',
            'description' => 'Médecin test',
        ]);

        $controller = new ResponsableController();
        $response = $controller->storeMedecin($request);

        $this->assertSame(201, $response->getStatusCode());
        $this->assertDatabaseHas('notifications', [
            'user_id' => $admin->id,
            'type' => 'nouveau_medecin',
            'message' => 'Un nouveau médecin a été ajouté.',
        ]);
    }

    public function test_it_creates_a_doctor_notification_when_a_new_appointment_is_created(): void
    {
        $specialite = Specialite::create([
            'nom' => 'Dermatologie',
            'description' => 'Dermatologie',
        ]);

        $doctorUser = User::create([
            'name' => 'Dr. Notification',
            'email' => 'doctor.appointment@test.com',
            'password' => Hash::make('password123'),
            'role' => 'medecin',
        ]);

        $doctor = Medecin::create([
            'user_id' => $doctorUser->id,
            'specialite_id' => $specialite->id,
            'telephone' => '0655667788',
            'description' => 'Médecin test',
            'status' => 'active',
        ]);

        $patientUser = User::create([
            'name' => 'Patient Test',
            'email' => 'patient.notification@test.com',
            'password' => Hash::make('password123'),
            'role' => 'patient',
        ]);

        Patient::create([
            'user_id' => $patientUser->id,
        ]);

        $tomorrow = Carbon::tomorrow()->toDateString();

        Disponibilite::create([
            'medecin_id' => $doctor->id,
            'date' => $tomorrow,
            'heure_debut' => '09:00:00',
            'heure_fin' => '10:00:00',
        ]);

        $request = Request::create('/rendez-vous', 'POST', [
            'medecin_id' => $doctor->id,
            'date' => $tomorrow,
            'heure' => '09:20',
        ]);
        $request->setUserResolver(fn () => $patientUser);

        $controller = new RendezVousController();
        $response = $controller->store($request);

        $this->assertSame(201, $response->getStatusCode());
        $this->assertDatabaseHas('notifications', [
            'user_id' => $doctorUser->id,
            'type' => 'nouveau_rendez_vous',
            'message' => 'Vous avez un nouveau rendez-vous.',
        ]);
    }
}
