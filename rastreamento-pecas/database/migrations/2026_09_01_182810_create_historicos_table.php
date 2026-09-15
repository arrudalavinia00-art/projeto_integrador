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
        Schema::create('historicos', function (Blueprint $table) {

    $table->id();

    $table->string('peca_id');

    $table->string('local');
    $table->time('horario');
    $table->date('data');

    $table->timestamps();

    $table->foreign('peca_id')
          ->references('id')
          ->on('pecas')
          ->cascadeOnDelete();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historicos');
    }
};
