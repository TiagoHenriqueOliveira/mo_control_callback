<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AtendimentoRelatorioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = in_array($this->method(), ['PUT', 'PATCH']);

        return [
            'aten_rel_atendimento_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'integer',
                'exists:atendimentos,aten_id',
            ],
            'aten_rel_modelo_relatorio_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'integer',
                'exists:modelos_relatorios,mod_rel_id',
            ],
            'aten_rel_data' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'date',
            ],
            'aten_rel_status' => [
                $isUpdate ? 'sometimes' : 'nullable',
                'integer',
                'in:0,1,2'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'aten_rel_atendimento_id.required' => 'Informe o atendimento.',
            'aten_rel_atendimento_id.exists' => 'Atendimento inválido.',
            'aten_rel_modelo_relatorio_id.required' => 'Informe o modelo de relatório.',
            'aten_rel_modelo_relatorio_id.exists' => 'Modelo de relatório inválido.',
            'aten_rel_status.in' => 'Status inválido (0 preenchendo | 1 revisar | 2 aprovado).',
        ];
    }
}
