<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClienteRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $cnpj = $this->input('cli_cnpj');
        $tel  = $this->input('cli_telefone');
        $uf   = $this->input('cli_uf');

        $this->merge([
            'cli_cnpj' => $cnpj !== null ? preg_replace('/\D+/', '', $cnpj) : $cnpj,
            'cli_telefone' => $tel !== null ? preg_replace('/\D+/', '', $tel) : $tel,

            'cli_uf' => $uf !== null ? strtoupper(trim($uf)) : $uf,
        ]);
    }

    public function rules()
    {
        $id = $this->route('cliente');

        return [
            'cli_nome' => ['required', 'string', 'max:100'],

            'cli_cnpj' => [
                'required',
                'digits:14',
                Rule::unique('clientes', 'cli_cnpj')->ignore($id, 'cli_id'),
            ],

            'cli_cidade' => ['required', 'string', 'max:100'],
            'cli_uf' => ['required', 'string', 'size:2'],
            'cli_telefone' => ['nullable', 'digits_between:10,11'],
            'cli_email' => ['nullable', 'email', 'max:100'],
            'cli_ativo' => ['nullable', 'boolean'],
        ];
    }

    public function messages()
    {
        return [
            'cli_nome.required' => 'O nome do cliente é obrigatório.',
            'cli_cnpj.required' => 'O CNPJ é obrigatório.',
            'cli_cnpj.digits' => 'O CNPJ deve conter 14 números.',
            'cli_cnpj.unique' => 'Este CNPJ já está cadastrado.',
            'cli_cidade.required' => 'A cidade é obrigatória.',
            'cli_uf.required' => 'A UF é obrigatória.',
            'cli_uf.size' => 'A UF deve conter 2 caracteres.',
            'cli_telefone.digits_between' => 'Informe um telefone com DDD e 10 ou 11 números.',
            'cli_email.email' => 'Informe um e-mail válido.',
        ];
    }
}
