<div class="tab-pane fade show active" id="tab-dados" role="tabpanel">
    <form id="form_relatorio_dados">

        {{-- RELATÓRIO (centralizado) --}}
        <div class="text-center mb-4">
            <p class="h5 font-weight-bold text-primary text-decoration-underline mb-0">
                Relatório Diário de Obra (RDO)
            </p>
        </div>

        {{-- LINHA: Data | Dia da Semana | Prazo | Decorrido | À Vencer --}}
        <div class="row mb-3">
            <div class="col-md-3">
                <label class="font-weight-bold">Data</label>
                <input type="date" class="form-control">
            </div>

            <div class="col-md-3 text-center">
                <label class="font-weight-bold">Dia da Semana</label>
                <span class="form-control-plaintext">
                    Segunda-feira
                </span>
            </div>

            <div class="col-md-2 text-center">
                <label class="font-weight-bold">Prazo (dias)</label>
                <span class="form-control-plaintext text-indigo">
                    15 dias
                </span>
            </div>

            <div class="col-md-2 text-center">
                <label class="font-weight-bold">Prazo Decorrido</label>
                <span class="form-control-plaintext text-warning">
                    7 dias
                </span>
            </div>

            <div class="col-md-2 text-center">
                <label class="font-weight-bold">Prazo à Vencer</label>
                <span class="form-control-plaintext text-success">
                    8 dias
                </span>
            </div>
        </div>

        {{-- LINHA: Obra | Endereço --}}
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="font-weight-bold">Obra</label>
                <input type="text" class="form-control">
            </div>

            <div class="col-md-6">
                <label class="font-weight-bold">Endereço</label>
                <span class="form-control-plaintext">
                    Rua das Laranjeiras, 258 – Distrito Industrial
                </span>
            </div>
        </div>

        {{-- LINHA: Cliente | Responsável | Nº Proposta --}}
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="font-weight-bold">Cliente</label>
                <span class="form-control-plaintext">
                    Nutriouro Alimentos LTDA
                </span>
            </div>

            <div class="col-md-4">
                <label class="font-weight-bold">Responsável</label>
                <span class="form-control-plaintext">
                    Rafael Oliveira
                </span>
            </div>

            <div class="col-md-2">
                <label class="font-weight-bold">Nº Proposta</label>
                <span class="form-control-plaintext">
                    000235/2026
                </span>
            </div>
        </div>

        <x-modal-footer />
    </form>
</div>