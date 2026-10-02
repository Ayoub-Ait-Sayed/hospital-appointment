<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Créer User
        |--------------------------------------------------------------------------
        */

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'patient',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Créer automatiquement le profil patient
        |--------------------------------------------------------------------------
        */

        Patient::create([
            'user_id' => $user->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Token
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'token' => $token,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Chercher utilisateur
        |--------------------------------------------------------------------------
        */

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Vérifier email + password
        |--------------------------------------------------------------------------
        */

        if (
            !$user ||
            !Hash::check(
                $validated['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'Email ou mot de passe incorrect.'
                ],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | VALIDATION DU MÉDECIN
        |--------------------------------------------------------------------------
        |
        | Un médecin doit être accepté par Admin
        | avant de pouvoir se connecter.
        |
        */

        if ($user->role === 'medecin') {

            /*
            |--------------------------------------------------------------------------
            | Récupérer le profil médecin
            |--------------------------------------------------------------------------
            */

            $medecin = $user->medecin;

            /*
            |--------------------------------------------------------------------------
            | Profil médecin introuvable
            |--------------------------------------------------------------------------
            */

            if (!$medecin) {
                return response()->json([
                    'message' => 'Profil médecin introuvable.'
                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | Médecin en attente
            |--------------------------------------------------------------------------
            */

            if ($medecin->status === 'pending') {

                return response()->json([
                    'message' =>
                        'Votre compte médecin est en attente de validation par l’administrateur.'
                ], 403);
            }


            /*
            |--------------------------------------------------------------------------
            | Médecin refusé
            |--------------------------------------------------------------------------
            */

            if ($medecin->status === 'refuse') {

                return response()->json([
                    'message' =>
                        'Votre demande pour devenir médecin a été refusée par l’administrateur.'
                ], 403);
            }


            /*
            |--------------------------------------------------------------------------
            | Vérifier que le médecin est actif
            |--------------------------------------------------------------------------
            */

            if ($medecin->status !== 'active') {

                return response()->json([
                    'message' =>
                        'Votre compte médecin n’est pas encore actif.'
                ], 403);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Créer le token
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;


        /*
        |--------------------------------------------------------------------------
        | Réponse
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    public function logout(Request $request)
    {
        $request
            ->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }
}

