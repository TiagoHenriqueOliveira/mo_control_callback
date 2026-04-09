<div class="modal fade" id="modal_relatorio" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title text-primary font-weight-bold">
                    Relatório de Atendimento
                </h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>

            <div class="modal-body ui-front">
                {{-- Tabs --}}
                <ul class="nav nav-tabs mb-3" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#tab-dados" role="tab">
                            Dados
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-horarios" role="tab">
                            Horário
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-clima" role="tab">
                            Clima
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-mao-obra" role="tab">
                            Mão de Obra
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-equipamentos" role="tab">
                            Equipamentos
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-atividades" role="tab">
                            Atividades
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-ocorrencias" role="tab">
                            Ocorrências
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-checklist" role="tab">
                            Checklist
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-materiais" role="tab">
                            Materiais
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-comentarios" role="tab">
                            Comentários
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-anexos" role="tab">
                            Anexos
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-fotos" role="tab">
                            Fotos
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-videos" role="tab">
                            Vídeos
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-assinatura" role="tab">
                            Assinatura
                        </a>
                    </li>
                </ul>

                <div class="tab-content p-2">
                    {{-- Tabs --}}
                    @include('atendimentos-relatorios.tabs.dados')
                    @include('atendimentos-relatorios.tabs.horarios')
                    @include('atendimentos-relatorios.tabs.clima')
                    @include('atendimentos-relatorios.tabs.mao-obra')
                    @include('atendimentos-relatorios.tabs.equipamentos')
                    @include('atendimentos-relatorios.tabs.atividades')
                    @include('atendimentos-relatorios.tabs.ocorrencias')
                    @include('atendimentos-relatorios.tabs.checklist')
                    @include('atendimentos-relatorios.tabs.materiais')
                    @include('atendimentos-relatorios.tabs.comentarios')
                    @include('atendimentos-relatorios.tabs.anexos')
                    @include('atendimentos-relatorios.tabs.assinaturas')
                </div>
            </div>
        </div>
    </div>
</div>