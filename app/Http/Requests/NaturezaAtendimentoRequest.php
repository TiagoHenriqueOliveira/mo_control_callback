<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NaturezaAtendimentoRequest extends FormRequest
{
    public function rules()
    {
        return [
            'nat_aten_descricao' => ['required', 'string', 'max:50'],
            'nat_aten_ativo' => ['nullable', 'boolean'],
        ];
    }
}
