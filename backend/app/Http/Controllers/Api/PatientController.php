<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function profile(Request $request)
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Profil patient introuvable'
            ], 404);
        }

        return response()->json([
            'patient' => $patient->load('user')
        ]);
    }
}

