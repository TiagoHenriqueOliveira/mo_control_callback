<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Repositories\ClienteRepository;
use Illuminate\Http\Request;

class ClientesController extends Controller
{
    public function __construct(
        private ClienteRepository $repository
    ) {}

    public function index(Request $request)
    {
        if ($request->ajax()) {
            $data = $this->repository->all()->map(function ($c) {
                return [
                    'acoes' => view('clientes.partials.acoes', compact('c'))->render(),
                    'cli_nome' => e($c->cli_nome),
                    'cli_cnpj' => e($c->cli_cnpj),
                    'cli_cidade' => e($c->cli_cidade),
                    'cli_uf' => e($c->cli_uf),
                    'cli_telefone' => e($c->cli_telefone),
                    'cli_email' => e($c->cli_email),
                    'cli_ativo' => (int) $c->cli_ativo,
                    'status' => $c->cli_ativo ? 'Ativo' : 'Desativado',
                ];
            });

            return response()->json(['data' => $data]);
        }

        return view('clientes.index');
    }

    public function store(ClienteRequest $request)
    {
        try {
            $this->repository->create($request->validated());
            return response()->json(['message' => 'Cadastrado com sucesso!']);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'Erro ao cadastrar.'], 500);
        }
    }

    public function update(ClienteRequest $request, int $id)
    {
        try {
            $this->repository->update($id, $request->validated());
            return response()->json(['message' => 'Atualizado com sucesso!']);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'Erro ao atualizar.'], 500);
        }
    }
}
