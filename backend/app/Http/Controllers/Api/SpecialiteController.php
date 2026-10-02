<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialite;

class SpecialiteController extends Controller
{
    public function index()
    {
        $specialites = Specialite::all();

        return response()->json([
            'specialites' => $specialites
        ]);
    }
}



   