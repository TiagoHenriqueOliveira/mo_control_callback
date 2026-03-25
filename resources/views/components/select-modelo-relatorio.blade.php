@props([
    'modelosRelatorios' => collect(),
])

<div class="form-group row">
    <label for="nat_aten_mod_relatorio_id" class="col-sm-3 col-form-label font-weight-bold">
        Modelo de Relatório:
    </label>

    <div class="col-sm-9">
        <select class="form-control"
            id="nat_aten_mod_relatorio_id"
            name="nat_aten_mod_relatorio_id"
            required>
            <option value="">Selecione...</option>
            @foreach($modelosRelatorios as $m)
            <option value="{{ $m->mod_rel_id }}">
                {{ $m->mod_rel_descricao }}
            </option>
            @endforeach
        </select>
    </div>
</div>