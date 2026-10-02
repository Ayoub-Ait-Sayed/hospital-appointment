<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendez_vouses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->foreignId('medecin_id')
                ->constrained('medecins')
                ->cascadeOnDelete();

            $table->date('date');
            $table->time('heure');

            $table->enum('statut', [
                'en_attente',
                'confirme',
                'annule',
                'termine'
            ])->default('en_attente');

            $table->timestamps();

            $table->unique([
                'medecin_id',
                'date',
                'heure'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendez_vouses');
    }
};