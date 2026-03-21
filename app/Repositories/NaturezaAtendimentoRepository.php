<?php

namespace App\Repositories;

use App\Models\NaturezaAtendimento;
use App\Repositories\Contracts\CrudRepositoryInterface;

class NaturezaAtendimentoRepository implements CrudRepositoryInterface
{
    public function all()
    {
        return NaturezaAtendimento::orderBy('nat_aten_descricao')->get();
    }

    public function create(array $data)
    {
        return NaturezaAtendimento::create([
            'nat_aten_descricao' => $data['nat_aten_descricao'],
            'nat_aten_ativo' => 1,
        ]);
    }

    public function update(int $id, array $data)
    {
        $natureza = NaturezaAtendimento::findOrFail($id);

        $natureza->update([
            'nat_aten_descricao' => $data['nat_aten_descricao'],
            'nat_aten_ativo' => $data['nat_aten_ativo'] ?? $natureza->nat_aten_ativo,
        ]);

        return $natureza;
    }
}
