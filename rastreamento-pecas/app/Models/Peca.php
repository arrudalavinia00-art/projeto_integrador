<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Peca extends Model
{
    protected $table = 'pecas';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'lote',
        'data_fabricacao',
        'local',
        'horario',
        'status'
    ];

    public function historicos(): HasMany
    {
        return $this->hasMany(Historico::class, 'peca_id');
    }
}