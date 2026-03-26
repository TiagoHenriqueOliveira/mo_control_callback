<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';
    protected $primaryKey = 'cli_id';
    public $timestamps = false;

    protected $fillable = [
        'cli_nome',
        'cli_cnpj',
        'cli_cidade',
        'cli_uf',
        'cli_telefone',
        'cli_email',
        'cli_ativo',
    ];

    protected $casts = [
        'cli_ativo' => 'boolean',
    ];
}
