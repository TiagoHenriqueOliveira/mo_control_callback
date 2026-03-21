<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoOcupacao extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'tipos_ocupacoes';
    protected $primaryKey = 'tp_ocup_id';

    protected $fillable = [
        'tp_ocup_descricao',
        'tp_ocup_ativo',
    ];

    protected $casts = [
        'tp_ocup_ativo' => 'integer',
    ];
}
