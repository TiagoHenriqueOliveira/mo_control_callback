<?php

namespace App\Http\Controllers;

use App\Models\TipoOcupacao;
use Illuminate\Http\Request;

class TipoOcupacaoController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $tipos = TipoOcupacao::select('tp_ocup_id', 'tp_ocup_descricao', 'tp_ocup_ativo')
                ->orderBy('tp_ocup_descricao')
                ->get();

            $data = $tipos->map(function ($t) {
                return [
                    'acoes' => '
                        <button type="button"
                            class="btn btn-sm btn-indigo btn-modal-tipo-ocupacao"
                            data-id="' . $t->tp_ocup_id . '"
                            data-descricao="' . e($t->tp_ocup_descricao) . '"
                            data-ativo="' . $t->tp_ocup_ativo . '">
                            <i class="fas fa-edit"></i>
                        </button>
                    ',
                    'tp_ocup_id' => $t->tp_ocup_id,
                    'tp_ocup_descricao' => $t->tp_ocup_descricao,
                    'tp_ocup_ativo' => (int) $t->tp_ocup_ativo,
                    'status' => ((int) $t->tp_ocup_ativo === 1) ? 'Ativo' : 'Desativado',
                ];
            });

            return response()->json(['data' => $data]);
        }

        return view('tipos_ocupacoes.index');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tp_ocup_descricao' => ['required', 'string', 'max:50'],
            ], [
                'tp_ocup_descricao.required' => 'A descrição é obrigatória.',
                'tp_ocup_descricao.max' => 'A descrição deve ter no máximo 50 caracteres.',
            ]);

            $tipo = new TipoOcupacao();
            $tipo->tp_ocup_descricao = $validated['tp_ocup_descricao'];
            $tipo->tp_ocup_ativo = 1;
            $tipo->save();

            return response()->json([
                'message' => 'Cadastrado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao cadastrar.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'tp_ocup_descricao' => ['required', 'string', 'max:50'],
                'tp_ocup_ativo' => ['nullable'],
            ], [
                'tp_ocup_descricao.required' => 'A descrição é obrigatória.',
                'tp_ocup_descricao.max' => 'A descrição deve ter no máximo 50 caracteres.',
            ]);

            $tipo = TipoOcupacao::findOrFail($id);
            $tipo->tp_ocup_descricao = $validated['tp_ocup_descricao'];
            $tipo->tp_ocup_ativo = (int) ($request->input('tp_ocup_ativo', 0) ? 1 : 0);
            $tipo->save();

            return response()->json([
                'message' => 'Atualizado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar.'
            ], 500);
        }
    }
}
