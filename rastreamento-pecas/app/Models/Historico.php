<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Historico extends Model
{
    protected $table = 'historicos';

    protected $fillable = [
        'peca_id',
        'local',
        'horario',
        'data'
    ];

    public function peca(): BelongsTo
    {
        return $this->belongsTo(Peca::class, 'peca_id');
    }
}