<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Peca;
use App\Models\Historico;

class PecaSeeder extends Seeder
{
    public function run(): void
    {
        Peca::create([
            'id' => 'PEC001',
            'lote' => 'LT2025',
            'data_fabricacao' => '2025-06-01',
            'local' => 'usinagem',
            'horario' => '07:54:00',
            'status' => 'Em Usinagem'
        ]);

        Historico::create([
            'peca_id' => 'PEC001',
            'local' => 'Recebimento',
            'horario' => '07:50:00',
            'data' => '2025-06-01'
        ]);

        Historico::create([
            'peca_id' => 'PEC001',
            'local' => 'caldeiraria',
            'horario' => '17:06:00',
            'data' => '2026-06-15'
        ]);

        Historico::create([
            'peca_id' => 'PEC001',
            'local' => 'usinagem',
            'horario' => '07:54:00',
            'data' => '2026-06-16'
        ]);
    }
}