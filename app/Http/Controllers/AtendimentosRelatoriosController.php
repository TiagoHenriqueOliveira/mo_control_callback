<?php

namespace App\Http\Controllers;

use App\Http\Requests\AtendimentoRelatorioRequest;
use App\Repositories\AtendimentoRelatorioRepository;
use Illuminate\Http\Request;

class AtendimentosRelatoriosController extends Controller
{
    public function __construct(
        private readonly AtendimentoRelatorioRepository $repo
    ) {}

    public function index(Request $request)
    {
        $relatorios = $this->repo->all([
            'aten_rel_atendimento_id' => $request->get('aten_rel_atendimento_id'),
        ]);

        return view('atendimentos-relatorios.index', compact('relatorios'));
    }

    public function store(AtendimentoRelatorioRequest $request)
    {
        $rel = $this->repo->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Relatório criado com sucesso.',
            'data'    => $rel,
        ], 201);
    }

    public function update(AtendimentoRelatorioRequest $request, int $atendimentos_relatorio)
    {
        $rel = $this->repo->update($atendimentos_relatorio, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Relatório atualizado com sucesso.',
            'data'    => $rel,
        ]);
    }
}
