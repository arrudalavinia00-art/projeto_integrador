<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PecaController;

Route::get('/pecas', [PecaController::class, 'index']);

Route::get('/pecas/{id}', [PecaController::class, 'show']);