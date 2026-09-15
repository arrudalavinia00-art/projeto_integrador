<?php

namespace App\Http\Controllers;

use App\Models\Peca;

class PecaController extends Controller
{
    public function index()
    {
        return response()->json(
            Peca::with('historicos')->get()
        );
    }

    public function show($id)
    {
        $peca = Peca::with('historicos')->find($id);

        if (!$peca) {
            return response()->json([
                'mensagem' => 'Peça não encontrada'
            ], 404);
        }

        return response()->json($peca);
    }
}