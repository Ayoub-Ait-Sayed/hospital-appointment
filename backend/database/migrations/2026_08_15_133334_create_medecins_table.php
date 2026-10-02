<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('medecins', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
          ->constrained('users')
          ->cascadeOnDelete();
    $table->string('image')->nullable();
    $table->foreignId('specialite_id')
          ->constrained('specialites')
          ->restrictOnDelete();

    $table->string('telephone', 20)->nullable();

    $table->text('description')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medecins');
    }
};
