<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\SpecialiteController;
use App\Http\Controllers\Api\MedecinController;
use App\Http\Controllers\Api\DisponibiliteController;
use App\Http\Controllers\Api\RendezVousController;
use App\Http\Controllers\Api\MedecinDisponibiliteController;
use App\Http\Controllers\Api\ResponsableController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminSpecialiteController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\NotificationController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get(
    '/specialites',
    [SpecialiteController::class, 'index']
);

// IMPORTANT : public
// لا auth لا role
Route::get(
    '/public-medecins',
    [MedecinController::class, 'index']
);
 


/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );

    Route::get('/user', function (Request $request) {

        return response()->json([
            'user' => $request->user()
        ]);

    });

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::put(
        '/notifications/{id}/read',
        [NotificationController::class, 'markAsRead']
    );
});


/*
|--------------------------------------------------------------------------
| PATIENT
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:patient'
])->group(function () {

    Route::get(
        '/patient/profile',
        [PatientController::class, 'profile']
    );

    Route::get(
        '/specialites/{specialiteId}/medecins',
        [MedecinController::class, 'bySpecialite']
    );

    Route::get(
        '/medecins/{medecinId}/disponibilites',
        [DisponibiliteController::class, 'byMedecin']
    );

    Route::post(
        '/rendez-vous',
        [RendezVousController::class, 'store']
    );

    Route::get(
        '/patient/rendez-vous',
        [RendezVousController::class, 'index']
    );

    Route::delete(
        '/patient/rendez-vous/{id}',
        [RendezVousController::class, 'destroy']
    );
});


/*
|--------------------------------------------------------------------------
| MEDECIN
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:medecin'
])->group(function () {

    Route::get(
        '/medecin/profile',
        [MedecinController::class, 'profile']
    );

    Route::post(
        '/medecin/profile/image',
        [MedecinController::class, 'uploadImage']
    );

    Route::get(
        '/medecin/disponibilites',
        [MedecinDisponibiliteController::class, 'index']
    );

    Route::post(
        '/medecin/disponibilites',
        [MedecinDisponibiliteController::class, 'store']
    );

    Route::put(
        '/medecin/disponibilites/{id}',
        [MedecinDisponibiliteController::class, 'update']
    );

    Route::delete(
        '/medecin/disponibilites/{id}',
        [MedecinDisponibiliteController::class, 'destroy']
    );

    Route::get(
        '/medecin/rendez-vous',
        [RendezVousController::class, 'medecinRendezVous']
    );

    Route::put(
        '/medecin/rendez-vous/{id}/confirmer',
        [RendezVousController::class, 'confirmer']
    );

    Route::put(
        '/medecin/rendez-vous/{id}/annuler',
        [RendezVousController::class, 'annulerParMedecin']
    );
});


/*
|--------------------------------------------------------------------------
| RESPONSABLE
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:responsable'
])->group(function () {

    Route::get(
        '/responsable/medecins',
        [ResponsableController::class, 'medecins']
    );

    Route::post(
        '/responsable/medecins',
        [ResponsableController::class, 'storeMedecin']
    );

    Route::put(
        '/responsable/medecins/{id}',
        [ResponsableController::class, 'updateMedecin']
    );

    Route::delete(
        '/responsable/medecins/{id}',
        [ResponsableController::class, 'destroyMedecin']
    );

    Route::get(
        '/responsable/patients',
        [ResponsableController::class, 'patients']
    );

    Route::get(
        '/responsable/patients/{id}',
        [ResponsableController::class, 'showPatient']
    );

    Route::delete(
        '/responsable/patients/{id}',
        [ResponsableController::class, 'destroyPatient']
    );

    Route::get(
        '/responsable/rendez-vous',
        [ResponsableController::class, 'rendezVous']
    );

    Route::get(
        '/responsable/rendez-vous/{id}',
        [ResponsableController::class, 'showRendezVous']
    );

    Route::put(
        '/responsable/rendez-vous/{id}',
        [ResponsableController::class, 'updateRendezVous']
    );

    Route::delete(
        '/responsable/rendez-vous/{id}',
        [ResponsableController::class, 'destroyRendezVous']
    );
});


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:admin'
])->group(function () {

    Route::get(
        '/admin/dashboard',
        [AdminController::class, 'dashboard']
    );

    Route::get(
        '/admin/demandes-medecins',
        [AdminController::class, 'demandesMedecins']
    );

    Route::put(
        '/admin/medecins/{id}/accepter',
        [AdminController::class, 'accepterMedecin']
    );

    Route::put(
        '/admin/medecins/{id}/refuser',
        [AdminController::class, 'refuserMedecin']
    );

    Route::put(
        '/admin/medecins/{id}/reactiver',
        [AdminController::class, 'reactiverMedecin']
    );

    Route::get(
        '/medecins',
        [MedecinController::class, 'index']
    );

    Route::get('/admin/test', function () {

        return response()->json([
            'message' => 'Bienvenue Admin'
        ]);

    });

    Route::get(
        '/admin/specialites',
        [AdminSpecialiteController::class, 'index']
    );

    Route::get(
        '/admin/specialites/{id}',
        [AdminSpecialiteController::class, 'show']
    );

    Route::post(
        '/admin/specialites',
        [AdminSpecialiteController::class, 'store']
    );

    Route::put(
        '/admin/specialites/{id}',
        [AdminSpecialiteController::class, 'update']
    );

    Route::delete(
        '/admin/specialites/{id}',
        [AdminSpecialiteController::class, 'destroy']
    );

    Route::get(
        '/admin/users',
        [AdminUserController::class, 'index']
    );

    Route::get(
        '/admin/users/{id}',
        [AdminUserController::class, 'show']
    );

    Route::put(
        '/admin/users/{id}/role',
        [AdminUserController::class, 'updateRole']
    );

    Route::delete(
        '/admin/users/{id}',
        [AdminUserController::class, 'destroy']
    );
});
