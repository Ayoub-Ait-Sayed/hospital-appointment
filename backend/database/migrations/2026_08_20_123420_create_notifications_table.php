<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {

            $table->id();

            // User li ghadi touslo notification
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // Type dyal notification
            $table->string('type');

            // Message dyal notification
            $table->string('message');

            // ID dyal l'objet lié ila kan
            // exemple: ID dyal médecin ou rendez-vous
            $table->unsignedBigInteger('reference_id')->nullable();

            // wach notification t9rat
            $table->boolean('read')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
