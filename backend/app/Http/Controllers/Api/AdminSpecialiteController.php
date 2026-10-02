<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialite;
use Illuminate\Http\Request;

class AdminSpecialiteController extends Controller
{
    public function index()
    {
        $specialites = Specialite::withCount('medecins')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'specialites' => $specialites
        ]);
    }


    /**
     * Afficher une spécialité
     */
    public function show($id)
    {
        $specialite = Specialite::with('medecins.user')
            ->findOrFail($id);

        return response()->json([
            'specialite' => $specialite
        ]);
    }


    /**
     * Ajouter une spécialité
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:specialites,nom',
            'description' => 'nullable|string',
        ]);

        $specialite = Specialite::create($validated);

        return response()->json([
            'message' => 'Spécialité ajoutée avec succès',
            'specialite' => $specialite
        ], 201);
    }


    /**
     * Modifier une spécialité
     */
    public function update(Request $request, $id)
    {
        $specialite = Specialite::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:specialites,nom,' . $id,
            'description' => 'nullable|string',
        ]);

        $specialite->update($validated);

        return response()->json([
            'message' => 'Spécialité modifiée avec succès',
            'specialite' => $specialite
        ]);
    }


    /**
     * Supprimer une spécialité
     */
    public function destroy($id)
    {
        $specialite = Specialite::findOrFail($id);

        // Vérifier si la spécialité est utilisée par des médecins
        if ($specialite->medecins()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer cette spécialité car elle est utilisée par un ou plusieurs médecins.'
            ], 409);
        }

        $specialite->delete();

        return response()->json([
            'message' => 'Spécialité supprimée avec succès'
        ]);
    }
}

