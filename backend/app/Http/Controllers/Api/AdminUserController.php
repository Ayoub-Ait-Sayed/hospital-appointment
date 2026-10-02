<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Afficher tous les utilisateurs
     */
    public function index()
    {
        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'created_at'
        )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }


    /**
     * Afficher un utilisateur
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }


    /**
     * Modifier le rôle d'un utilisateur
     */
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:patient,medecin,responsable,admin',
        ]);

        $user = User::findOrFail($id);

        // Empêcher l'admin de modifier son propre rôle
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre rôle.'
            ], 403);
        }

        $user->update([
            'role' => $validated['role']
        ]);

        return response()->json([
            'message' => 'Rôle modifié avec succès',
            'user' => $user->fresh()
        ]);
    }


    /**
     * Supprimer un utilisateur
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Empêcher l'admin de supprimer son propre compte
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}

