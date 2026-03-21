<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NaturezaAtendimento extends Model
{
    use HasFactory;

    protected $table = 'naturezas_atendimentos';
    protected $primaryKey = 'nat_aten_id';
    public $timestamps = false;

    protected $fillable = [
        'nat_aten_descricao',
        'nat_aten_ativo',
    ];

    protected $casts = [
        'nat_aten_ativo' => 'boolean',
    ];
}
