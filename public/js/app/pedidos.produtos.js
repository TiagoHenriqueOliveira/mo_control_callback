$(document).ready(function () {
    configDataTableProdutosReservadosDoEstoque();
    configButtons();
    configVolumesTabs();
    configPesquisarProduto();
    configDocumentosDigitais();
    configFormularios();
});

$('#pills_reservado_estoque_tab').on('click', function () {
    if ($.fn.DataTable.isDataTable('#dataTable_ProdutosReservadosDoEstoque')) {
        $('#dataTable_ProdutosReservadosDoEstoque').DataTable().ajax.reload(null, false);
    }
});

$('#pills_reservado_requisicao_tab').on('click', function () {
    if (!$.fn.DataTable.isDataTable('#dataTable_ProdutosReservadosDeRequisicao')) {
        configDataTableProdutosReservadosDeRequisicao();
    } else {
        $('#dataTable_ProdutosReservadosDeRequisicao').DataTable().ajax.reload(null, false);
    }
});

$('#pills_reservado_ocp_tab').on('click', function () {
    if (!$.fn.DataTable.isDataTable('#dataTable_ProdutosReservadosDeOCP')) {
        configDataTableProdutosReservadosDeOCP();
    } else {
        $('#dataTable_ProdutosReservadosDeOCP').DataTable().ajax.reload(null, false);
    }
});

function configDataTableProdutosReservadosDoEstoque() {
    let paramURL = NR_PEDIDO.replace('/', '');

    let columns = [];
    let columnDefs = [];
    let targetsIndex = 0;

    if (TIPO_ROTA !== 'visualizar') {
        columns.push({ data: "acoes", orderable: false, searchable: false });
        columnDefs.push({ width: "5%", targets: targetsIndex });
        targetsIndex++;
    }

    columns = columns.concat([
        { data: "local" },
        { data: "produto" },
        { data: "descricao" },
        { data: "un" },
        { data: "seq" },
        { data: "quantidade" },
        { data: "qtd_reservada" },
        { data: "qtd_separada" },
        { data: "qtd_conferida" }
    ]);

    const commonWidths = ["5%", "10%", "40%", "5%", "5%", "5%", "5%", "5%", "5%"];
    commonWidths.forEach(width => {
        columnDefs.push({ width: width, targets: targetsIndex });
        targetsIndex++;
    });

    $("#dataTable_ProdutosReservadosDoEstoque").DataTable({
        destroy: true,
        responsive: true,
        ordering: false,
        pageLength: 25,
        stateSave: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
        },
        ajax: {
            url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + paramURL,
            type: "GET",
            data: {
                tipo_dados: 1
            },
            dataSrc: "data"
        },
        columns: columns,
        columnDefs: columnDefs,
        "createdRow": function (row, data, index) {
            let startIndex = TIPO_ROTA === 'visualizar' ? 0 : 1;

            if (TIPO_ROTA !== 'visualizar') {
                $('td', row).eq(0).addClass("text-center");
            }

            $('td', row).eq(startIndex + 1).mask("#.###.###.######");
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.qtd_separada === aData.qtd_reservada) {
                $('td', nRow).addClass("alert-success");
            }

            if ((TIPO_ROTA === 'conferencia') && (aData.qtd_conferida === aData.qtd_separada)) {
                $('td', nRow).addClass("alert-purple");
            }

            if ((TIPO_ROTA === 'conferencia') && (aData.qtd_conferida !== aData.qtd_separada)) {
                $('td', nRow).addClass("alert-danger");
            }
        }
    });
}

function configDataTableProdutosReservadosDeRequisicao() {
    let paramURL = NR_PEDIDO.replace('/', '');

    $("#dataTable_ProdutosReservadosDeRequisicao").DataTable({
        destroy: true,
        responsive: true,
        ordering: false,
        pageLength: 25,
        stateSave: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
        },
        ajax: {
            url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + paramURL,
            type: "GET",
            data: {
                tipo_dados: 2
            },
            dataSrc: "data"
        },
        columns: [
            { data: "local" },
            { data: "produto" },
            { data: "descricao" },
            { data: "un" },
            { data: "seq" },
            { data: "quantidade" },
            { data: "saldo_requisicao" },
            { data: "requisicao" },
            { data: "opd" }
        ],
        columnDefs: [
            { width: "5%", targets: 0 },
            { width: "10%", targets: 1 },
            { width: "35%", targets: 2 },
            { width: "5%", targets: 3 },
            { width: "5%", targets: 4 },
            { width: "10%", targets: 5 },
            { width: "10%", targets: 6 },
            { width: "10%", targets: 7 },
            { width: "10%", targets: 8 }
        ],
        "createdRow": function (row, data, index) {
            $('td', row).eq(1).mask("#.###.###.######");
        }
    });
}

function configDataTableProdutosReservadosDeOCP() {
    let paramURL = NR_PEDIDO.replace('/', '');

    $("#dataTable_ProdutosReservadosDeOCP").DataTable({
        destroy: true,
        responsive: true,
        ordering: false,
        pageLength: 25,
        stateSave: true,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
        },
        ajax: {
            url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + paramURL,
            type: "GET",
            data: {
                tipo_dados: 3
            },
            dataSrc: "data"
        },
        columns: [
            { data: "local" },
            { data: "produto" },
            { data: "descricao" },
            { data: "un" },
            { data: "seq" },
            { data: "quantidade" },
            { data: "saldo_ocp" },
            { data: "ocp" }
        ],
        columnDefs: [
            { width: "5%", targets: 0 },
            { width: "10%", targets: 1 },
            { width: "45%", targets: 2 },
            { width: "5%", targets: 3 },
            { width: "5%", targets: 4 },
            { width: "10%", targets: 5 },
            { width: "10%", targets: 6 },
            { width: "10%", targets: 7 }
        ],
        "createdRow": function (row, data, index) {
            $('td', row).eq(1).mask("#.###.###.######");
        }
    });
}

function configButtons() {
    $(document).on('click', '.btn-quantidades', function () {
        const nrPedido = $(this).data('nr-pedido');
        const cdProduto = $(this).data('cd-produto');
        const seqProduto = $(this).data('seq-produto');
        const qtdReservada = $(this).data('qtd-reservada');
        const qtdTotalSeparada = $(this).data('qtd-tot-separada');
        const qtdTotalConferido = $(this).data('qtd-tot-conferido');
        const flTipo = TIPO_ROTA === 'separacao' ? 1 : (TIPO_ROTA === 'conferencia' ? 2 : null);

        if (flTipo) {
            exibirModalQuantidades(
                TIPO_ROTA === 'separacao' ? 'Separação' : 'Conferência',
                nrPedido,
                cdProduto,
                seqProduto,
                qtdReservada,
                qtdTotalSeparada,
                qtdTotalConferido,
                flTipo
            );
        }
    });

    if (TIPO_ROTA === 'separacao') {
        $('#btn_finalizar_separacao').on('click', function () {
            verificarSeparacaoCompletaAntesFinalizar();
        });
    }

    if (TIPO_ROTA === 'conferencia') {
        $('#btn_finalizar_conferencia').on('click', function () {
            verificarConferenciaCompletaAntesFinalizar();
        });

        $('#btn_volumes').on('click', function () {
            $('#modalVolumes').modal({
                backdrop: 'static',
                keyboard: false
            });

            $('#modalVolumes').on('shown.bs.modal', function () {
                setTimeout(function () {
                    $("#volumes").trigger('focus');
                }, 200);
            });

            $('#modalVolumes').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                setTimeout(function () {
                    $('#pesquisa_produto').val('').focus();
                }, 100);
            });
        });

        $('#btn_documentos_digitais').on('click', function () {
            $('#modalDocumentosDigitais').modal({
                backdrop: 'static',
                keyboard: false
            });

            $('#modalDocumentosDigitais').on('shown.bs.modal', function () {
                setTimeout(function () {
                    $('#dropArea').focus();
                }, 200);
            });

            $('#modalDocumentosDigitais').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                setTimeout(function () {
                    $('#pesquisa_produto').val('').focus();
                    limparPreviews();
                }, 100);
            });
        });
    }
}

function configMaskNumeric() {
    $('.numeric').mask('#.##0,000', {
        reverse: true
    });
}

function configVolumesTabs() {
    let currentVolumes = 1;

    $('#dimensoes-tab').on('click', function () {
        atualizarDimensoes();
    });

    $('#volumes').on('change input', function () {
        const qtdVolumes = parseInt($(this).val()) || 1;
        currentVolumes = qtdVolumes;
    });

    configMaskNumeric();
}

function configPesquisarProduto() {
    setTimeout(function () {
        $('#pesquisa_produto').focus();
    }, 300);

    $('#limpar_pesquisa').on('click', function () {
        $('#pesquisa_produto').val('').focus();

        const table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();
        table.$('tr').removeClass('table-primary');
        table.search('').columns().search('').draw();
    });

    $('#pesquisa_produto').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            pesquisarProdutoPorCodigo($(this).val().trim());
        }
    });
}

function configDocumentosDigitais() {
    $('#modalDocumentosDigitais').on('shown.bs.modal', function () {
        uploadManager.init();
    });
}

function configFormularios() {
    $('#form_quantidades').on('submit', function (e) {
        e.preventDefault();
        enviarQuantidades();
    });

    $('#form_volumes').on('submit', function (e) {
        e.preventDefault();
        enviarVolumes();
    });
}

function enviarQuantidades() {
    const form = $('#form_quantidades');
    const submitButton = form.find('button[type="submit"]');

    let quantidade = parseFloat($('#quantidade').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
    let qtd_reservada = parseFloat($('#qtd_reservada_hidden').val()) || 0;
    let qtd_tot_separada = parseFloat($('#qtd_tot_separada_hidden').val()) || 0;
    let qtd_tot_conferido = parseFloat($('#qtd_tot_conferido_hidden').val()) || 0;
    let fl_tipo = $('#fl_tipo_hidden').val();

    // PEGA O CÓDIGO DO PRODUTO DO CAMPO OCULTO E REMOVE OS PONTOS
    let cdProdutoOriginal = $('#cd_produto_hidden').val();
    let cdProdutoLimpo = cdProdutoOriginal.replace(/\./g, '');

    console.log('Código produto original (com pontos):', cdProdutoOriginal);
    console.log('Código produto limpo (sem pontos):', cdProdutoLimpo);

    if (isNaN(quantidade) || quantidade <= 0) {
        showNotification('fas fa-warning', 'Quantidade inválida!', 'warning', 5000);
        return false;
    }

    if (fl_tipo == 1) {
        if ((qtd_tot_separada + quantidade) > qtd_reservada) {
            showNotification('fas fa-warning',
                'Quantidade <span class="font-weight-bolder text-danger">excede a quantidade reservada</span>!<br>' +
                'Já separado: ' + qtd_tot_separada + '<br>' +
                'Saldo da reserva: ' + (qtd_reservada - qtd_tot_separada) + '<br>',
                'warning', 6000);
            return false;
        }
    } else {
        if ((qtd_tot_conferido + quantidade) > qtd_tot_separada) {
            showNotification('fas fa-warning',
                'Quantidade <span class="font-weight-bolder text-danger">excede a quantidade separada</span>!<br>' +
                'Já conferido: ' + qtd_tot_conferido + '<br>' +
                'Já separado: ' + qtd_tot_separada + '<br>',
                'warning', 6000);
            return false;
        }
    }

    form.find('input.numeric').each(function () {
        let valor = $(this).val();
        valor = valor.replace(/\./g, '').replace(/,/g, '.');
        $(this).val(valor);
    });

    // ATUALIZA O CAMPO OCULTO COM O CÓDIGO LIMPO ANTES DE SERIALIZAR
    $('#cd_produto_hidden').val(cdProdutoLimpo);

    let formData = form.serialize();
    console.log('Dados do formulário serializados (com código limpo):', formData);

    submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Processando...');

    $.ajax({
        url: form.attr('action'),
        type: "POST",
        data: formData,
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            showNotification('fas fa-check', response.message, 'success', 3000);

            // RESTAURA O CÓDIGO COM PONTOS NO CAMPO OCULTO (OPCIONAL)
            $('#cd_produto_hidden').val(cdProdutoOriginal);

            if ($.fn.DataTable.isDataTable('#dataTable_ProdutosReservadosDoEstoque')) {
                var table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();

                table.ajax.reload(function () {
                    $('#modalQuantidades').modal('hide');
                    form[0].reset();
                }, false);
            } else {
                $('#modalQuantidades').modal('hide');
                form[0].reset();
            }
        },
        error: function (xhr) {
            // RESTAURA O CÓDIGO COM PONTOS EM CASO DE ERRO
            $('#cd_produto_hidden').val(cdProdutoOriginal);

            submitButton.prop('disabled', false).html('<i class="fas fa-check mr-2"></i>Confirmar');

            if (xhr.status === 422) {
                if (xhr.responseJSON.errors) {
                    let errors = xhr.responseJSON.errors;
                    let errorMessages = '<ul>';
                    $.each(errors, function (key, messages) {
                        $.each(messages, function (index, message) {
                            errorMessages += '<li>' + key + ': ' + message + '</li>';
                        });
                    });
                    errorMessages += '</ul>';
                    showNotification('fas fa-bug', 'Ocorreram erros ao salvar o registro:<br>' + errorMessages, 'danger', 5000);
                } else if (xhr.responseJSON.message) {
                    showNotification('fas fa-exclamation-triangle', xhr.responseJSON.message, 'warning', 5000);
                }
            } else {
                showNotification('fas fa-bug', 'Ops... um erro inesperado ocorreu! Código: ' + xhr.status, 'danger', 5000);
            }

            setTimeout(function () {
                $('#pesquisa_produto').focus();
            }, 300);
        },
        complete: function () {
            setTimeout(function () {
                submitButton.prop('disabled', false).html('<i class="fas fa-check mr-2"></i>Confirmar');
            }, 2000);
        }
    });
}

function enviarVolumes() {
    const form = $('#form_volumes');
    const submitButton = form.find('button[type="submit"]');

    if (!$('#volumes-tab').hasClass('active')) {
        showNotification('fas fa-info', 'Para salvar, volte para a aba "Volumes"', 'info', 3000);
        $('#volumes-tab').tab('show');
        return false;
    }

    const erroDimensoes = validarDimensoesConsistentes();
    if (erroDimensoes) {
        showNotification('fas fa-warning', erroDimensoes, 'warning', 5000);
        $('#dimensoes-tab').tab('show');
        return false;
    }

    let volumes = parseFloat($('#volumes').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
    let peso = parseFloat($('#peso').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
    let especie = $('#especie').val();
    let marca = $('#marca').val();

    let dimensoes = [];
    let dimensoesInvalidas = false;

    $('.volume-dimensoes').each(function () {
        const volumeNum = $(this).data('volume');
        const altura = parseFloat($(this).find('.dimensao-altura').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const comprimento = parseFloat($(this).find('.dimensao-comprimento').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const largura = parseFloat($(this).find('.dimensao-largura').val().replace(/\./g, '').replace(/,/g, '.')) || 0;

        dimensoes.push({
            volume: volumeNum,
            altura: altura,
            comprimento: comprimento,
            largura: largura
        });

        if (altura < 0 || comprimento < 0 || largura < 0) {
            dimensoesInvalidas = true;
        }
    });

    if (isNaN(volumes) || volumes <= 0) {
        showNotification('fas fa-warning', 'Volumes inválidos!', 'warning', 5000);
        $('#volumes').focus();
        return false;
    }

    if (isNaN(peso) || peso <= 0) {
        showNotification('fas fa-warning', 'Peso inválido!', 'warning', 5000);
        $('#peso').focus();
        return false;
    }

    if (!especie || especie.trim() === '') {
        showNotification('fas fa-warning', 'Espécie não informada!', 'warning', 5000);
        $('#especie').focus();
        return false;
    }

    if (dimensoesInvalidas) {
        showNotification('fas fa-warning', 'Altura/Comprimento/Largura inválidos em algum volume! (não podem ser negativos)', 'warning', 5000);
        $('#dimensoes-tab').tab('show');
        return false;
    }

    if (!marca || marca.trim() === '') {
        showNotification('fas fa-warning', 'Marca não informada!', 'warning', 5000);
        $('#marca').focus();
        return false;
    }

    let formData = new FormData();
    formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
    formData.append('nr_pedido', NR_PEDIDO);
    formData.append('especie', especie);
    formData.append('marca', marca);
    formData.append('volumes', volumes);
    formData.append('peso', peso);
    formData.append('dimensoes', JSON.stringify(dimensoes));

    submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Processando...');

    $.ajax({
        url: form.attr('action'),
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
            showNotification('fas fa-check', response.message, 'success', 3000);
            $('#modalVolumes').modal('hide');
            $('#btn_volumes').prop('disabled', true);
            $('#btn_finalizar_conferencia').prop('disabled', false);
        },
        error: function (xhr) {
            submitButton.prop('disabled', false).html('<i class="fas fa-check mr-2"></i>Salvar');

            if (xhr.status === 422) {
                if (xhr.responseJSON.errors) {
                    let errors = xhr.responseJSON.errors;
                    let errorMessages = '<ul>';
                    $.each(errors, function (key, messages) {
                        $.each(messages, function (index, message) {
                            errorMessages += '<li>' + key + ': ' + message + '</li>';
                        });
                    });
                    errorMessages += '</ul>';
                    showNotification('fas fa-bug', 'Ocorreram erros ao salvar o registro:<br>' + errorMessages, 'danger', 5000);
                } else if (xhr.responseJSON.message) {
                    showNotification('fas fa-exclamation-triangle', xhr.responseJSON.message, 'warning', 5000);
                }
            } else {
                showNotification('fas fa-bug', 'Ops... um erro inesperado ocorreu! Código: ' + xhr.status, 'danger', 5000);
            }
        },
        complete: function () {
            setTimeout(function () {
                submitButton.prop('disabled', false).html('<i class="fas fa-check mr-2"></i>Salvar');
            }, 2000);
        }
    });
}

function pesquisarProdutoPorCodigo(codigo) {
    if (!codigo || codigo.trim() === '') {
        showNotification('fas fa-info-circle', 'Digite um código de produto', 'info', 3000);
        return;
    }

    const table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();
    const searchTerm = codigo.replace(/\D/g, '');

    const allData = table.rows().data().toArray();

    const produtosEncontrados = allData.filter(row => {
        if (!row || !row.produto) return false;
        const produtoCodigo = row.produto.toString().replace(/\D/g, '');
        return produtoCodigo.includes(searchTerm);
    });

    if (produtosEncontrados.length === 0) {
        showNotification('fas fa-exclamation-triangle', `Produto ${codigo} não encontrado na lista`, 'warning', 3000);
        $('#pesquisa_produto').val('').focus();
        return;
    }

    let produtoParaAbrir = null;

    if (TIPO_ROTA === 'separacao') {
        produtoParaAbrir = produtosEncontrados.find(produto => {
            const qtdSeparada = parseFloat(produto.qtd_separada.replace(/\./g, '').replace(/,/g, '.')) || 0;
            const qtdReservada = parseFloat(produto.qtd_reservada.replace(/\./g, '').replace(/,/g, '.')) || 0;
            return qtdSeparada < qtdReservada;
        });
    } else if (TIPO_ROTA === 'conferencia') {
        produtoParaAbrir = produtosEncontrados.find(produto => {
            const qtdConferida = parseFloat(produto.qtd_conferida.replace(/\./g, '').replace(/,/g, '.')) || 0;
            const qtdSeparada = parseFloat(produto.qtd_separada.replace(/\./g, '').replace(/,/g, '.')) || 0;
            return qtdConferida < qtdSeparada;
        });
    } else {
        produtoParaAbrir = produtosEncontrados[0];
    }

    if (!produtoParaAbrir) {
        produtoParaAbrir = produtosEncontrados[0];
    }

    table.$('tr').removeClass('table-primary');
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        const rowData = this.data();
        if (!rowData || !rowData.produto) return;

        const produtoCodigo = rowData.produto.toString().replace(/\D/g, '');

        if (produtoCodigo.includes(searchTerm)) {
            $(this.node()).addClass('table-primary');
        }
    });

    if (produtosEncontrados.length > 1) {
        const qtdSeparada = parseFloat(produtoParaAbrir.qtd_separada.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const qtdReservada = parseFloat(produtoParaAbrir.qtd_reservada.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const qtdConferida = parseFloat(produtoParaAbrir.qtd_conferida.replace(/\./g, '').replace(/,/g, '.')) || 0;

        let statusProduto = '';
        if (TIPO_ROTA === 'separacao') {
            if (qtdSeparada >= qtdReservada) {
                statusProduto = '(separação já concluída)';
            } else {
                statusProduto = '(pendente)';
            }
        } else if (TIPO_ROTA === 'conferencia') {
            if (qtdConferida >= qtdSeparada) {
                statusProduto = '(conferência já concluída)';
            } else {
                statusProduto = '(pendente)';
            }
        }

        showNotification('fas fa-info-circle',
            `Código repetido: ${produtosEncontrados.length} produtos encontrados.<br>
            Abrindo sequencial: <strong>${produtoParaAbrir.seq} ${statusProduto}</strong>`,
            'info', 4000);
    }

    if (TIPO_ROTA === 'separacao' || TIPO_ROTA === 'conferencia') {
        $('#pesquisa_produto').val('');

        const flTipo = TIPO_ROTA === 'separacao' ? 1 : 2;

        exibirModalQuantidades(
            TIPO_ROTA === 'separacao' ? 'Separação' : 'Conferência',
            NR_PEDIDO,
            produtoParaAbrir.produto.replace(/\D/g, ''),
            produtoParaAbrir.seq,
            parseFloat(produtoParaAbrir.qtd_reservada.replace(/\./g, '').replace(/,/g, '.')) || 0,
            parseFloat(produtoParaAbrir.qtd_separada.replace(/\./g, '').replace(/,/g, '.')) || 0,
            parseFloat(produtoParaAbrir.qtd_conferida.replace(/\./g, '').replace(/,/g, '.')) || 0,
            flTipo
        );
    } else {
        setTimeout(function () {
            $('#pesquisa_produto').val('').focus();
        }, 100);
    }
}

function atualizarDimensoes() {
    const qtdVolumes = parseInt($('#volumes').val()) || 1;
    const container = $('#dimensoes-container');

    container.find('.volume-dimensoes:gt(0)').remove();

    if (qtdVolumes > 1) {
        for (let i = 2; i <= qtdVolumes; i++) {
            const volumeHtml = `
                <div class="volume-dimensoes" data-volume="${i}">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Volume ${i}</h6>
                        </div>
                        <div class="card-body p-0 my-1">
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                <div class="form-group text-center w-100">
                                    <label class="font-weight-bold d-block">Dimensões:</label>
                                    <div class="d-flex justify-content-center">
                                        <div class="col-4">
                                            <input type="text" class="form-control numeric text-center dimensao-altura" name="altura[]" inputmode="numeric" placeholder="Altura">
                                        </div>
                                        <div class="col-4">
                                            <input type="text" class="form-control numeric text-center dimensao-comprimento" name="comprimento[]" inputmode="numeric" placeholder="Comprimento">
                                        </div>
                                        <div class="col-4">
                                            <input type="text" class="form-control numeric text-center dimensao-largura" name="largura[]" inputmode="numeric" placeholder="Largura">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(volumeHtml);
        }
    }

    configMaskNumeric();
}

function validarDimensoesConsistentes() {
    let algumPreenchido = false;
    let algumVazio = false;
    let dimensoesParciais = false;

    $('.volume-dimensoes').each(function (index) {
        const altura = parseFloat($(this).find('.dimensao-altura').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const comprimento = parseFloat($(this).find('.dimensao-comprimento').val().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const largura = parseFloat($(this).find('.dimensao-largura').val().replace(/\./g, '').replace(/,/g, '.')) || 0;

        const volumePreenchido = altura > 0 || comprimento > 0 || largura > 0;
        const volumeVazio = altura === 0 && comprimento === 0 && largura === 0;

        const parcial = (altura > 0 && (comprimento === 0 || largura === 0)) ||
            (comprimento > 0 && (altura === 0 || largura === 0)) ||
            (largura > 0 && (altura === 0 || comprimento === 0));

        if (volumePreenchido) {
            algumPreenchido = true;
        }
        if (volumeVazio) {
            algumVazio = true;
        }
        if (parcial) {
            dimensoesParciais = true;
        }
    });

    if (algumPreenchido && algumVazio) {
        return 'Todos os volumes devem ter dimensões preenchidas!';
    }

    if (dimensoesParciais) {
        return 'Dimensões incompletas em algum volume!';
    }

    return null;
}

function exibirModalQuantidades(titulo, nrPedido, cdProduto, seqProduto, qtdReservada, qtdTotalSeparada, qtdTotalConferido, flTipo) {
    // Salva a posição atual da rolagem
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    $('#modalQuantidadesLabel').text(titulo).addClass("font-weight-bold");

    $('#nr_pedido_hidden').val(nrPedido);
    $('#cd_produto_hidden').val(cdProduto);
    $('#seq_produto_hidden').val(seqProduto);
    $('#qtd_reservada_hidden').val(qtdReservada);
    $('#qtd_tot_separada_hidden').val(qtdTotalSeparada);
    $('#qtd_tot_conferido_hidden').val(qtdTotalConferido);
    $('#fl_tipo_hidden').val(flTipo);

    $('#quantidade').val('');

    $('#modalQuantidades').off('shown.bs.modal').on('shown.bs.modal', function () {
        $('#quantidade').focus();
    }).off('hidden.bs.modal').on('hidden.bs.modal', function () {
        setTimeout(function () {
            $('#pesquisa_produto').val('').focus();

            // Restaura a posição da rolagem
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant' // Use 'auto' se preferir sem animação
            });

            const table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();
            table.$('tr').removeClass('table-primary');
        }, 100);
    });

    $('#modalQuantidades').modal({
        backdrop: 'static',
        keyboard: false,
        focus: false
    });
}

function exibirModalFinalizacao(titulo, mensagem, callbackConfirmacao) {
    $('#modalFinalizacaoLabel').text(titulo).addClass("font-weight-bold");
    $('.modalMensagem').html(mensagem);

    $('.modalButtonConfirmar').off('click').on('click', function () {
        $('#modalFinalizacao').modal('hide');
        if (typeof callbackConfirmacao === 'function') {
            callbackConfirmacao();
        }

        setTimeout(function () {
            $('#pesquisa_produto').val('').focus();
        }, 300);
    });

    $('#modalFinalizacao').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        $('.modalButtonConfirmar').off('click');

        setTimeout(function () {
            $('#pesquisa_produto').val('').focus();
        }, 300);
    });

    $('#modalFinalizacao').modal({
        backdrop: 'static',
        keyboard: false,
        focus: true
    });
}

function exibirModalAlertaPendencia(mensagem, tipo) {
    $('#modalAlertaPendencia .modalMensagemPendencia').html(mensagem);

    $('#btnContinuarComPendencias').off('click').on('click', function () {
        $('#modalAlertaPendencia').modal('hide');

        if (tipo === 'separacao') {
            exibirModalFinalizacao(
                'Finalizar Separação',
                'Deseja finalizar a separação do pedido <strong>' + formatarCodigoSinprod(NR_PEDIDO) + '</strong>?<br>' +
                '<span class="text-warning">⚠️ Atenção: Existem pendências de produção/compras!</span>',
                function () {
                    finalizarProcesso(NR_PEDIDO, 22, baseURL + '/pedidos/listagem');
                    atualizarTempoPedido(NR_PEDIDO, 1);
                }
            );
        } else {
            exibirModalFinalizacao(
                'Finalizar Conferência',
                'Deseja finalizar a conferência do pedido <strong>' + formatarCodigoSinprod(NR_PEDIDO) + '</strong>?<br>' +
                '<span class="text-warning">⚠️ Atenção: Existem pendências de produção/compras!</span>',
                function () {
                    finalizarProcesso(NR_PEDIDO, 10, baseURL + '/pedidos/listagem');
                    atualizarTempoPedido(NR_PEDIDO, 2);
                }
            );
        }
    });

    $('#modalAlertaPendencia').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function verificarSeparacaoCompletaAntesFinalizar() {
    const table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();
    const allData = table.rows().data().toArray();

    let itensPendentes = [];
    let itensComProducaoPendente = [];
    let itensComCompraPendente = [];

    allData.forEach(item => {
        const qtdSeparada = parseFloat(item.qtd_separada?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const qtdReservada = parseFloat(item.qtd_reservada?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;

        if (qtdSeparada < qtdReservada) {
            itensPendentes.push({
                produto: item.produto,
                descricao: item.descricao,
                separado: qtdSeparada,
                reservado: qtdReservada
            });
        }
    });

    $.ajax({
        url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + NR_PEDIDO.replace('/', ''),
        type: "GET",
        data: {
            tipo_dados: 2
        },
        dataType: "json",
        success: function (responseRequisicao) {
            if (responseRequisicao.data && responseRequisicao.data.length > 0) {
                itensComProducaoPendente = responseRequisicao.data.filter(item => {
                    const saldoRequisicao = parseFloat(item.saldo_requisicao?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
                    return saldoRequisicao > 0;
                });
            }

            $.ajax({
                url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + NR_PEDIDO.replace('/', ''),
                type: "GET",
                data: {
                    tipo_dados: 3
                },
                dataType: "json",
                success: function (responseCompra) {
                    if (responseCompra.data && responseCompra.data.length > 0) {
                        itensComCompraPendente = responseCompra.data.filter(item => {
                            const saldoOcp = parseFloat(item.saldo_ocp?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
                            return saldoOcp > 0;
                        });
                    }

                    processarResultadoVerificacoesSeparacao(itensPendentes, itensComProducaoPendente, itensComCompraPendente);
                },
                error: function () {
                    processarResultadoVerificacoesSeparacao(itensPendentes, itensComProducaoPendente, []);
                }
            });
        },
        error: function () {
            processarResultadoVerificacoesSeparacao(itensPendentes, [], []);
        }
    });
}

function processarResultadoVerificacoesSeparacao(itensPendentes, itensProducao, itensCompra) {
    if (itensPendentes.length > 0) {
        let mensagem = 'Existem itens que não foram separados completamente:<br><br>';
        itensPendentes.slice(0, 5).forEach(item => {
            mensagem += `• ${formatarCodigoProduto(item.produto)} - ${item.descricao.substring(0, 30)}...<br>`;
            mensagem += `  Separado: ${item.separado} de ${item.reservado}<br>`;
        });

        if (itensPendentes.length > 5) {
            mensagem += `... e mais ${itensPendentes.length - 5} itens.<br>`;
        }

        mensagem += '<br><span class="text-danger font-weight-bold">Finalização não permitida!</span>';

        showNotification('fas fa-exclamation-triangle', mensagem, 'warning', 8000);
        return;
    }

    const temProducaoPendente = itensProducao.length > 0;
    const temCompraPendente = itensCompra.length > 0;

    if (temProducaoPendente || temCompraPendente) {
        let mensagem = '';

        if (temProducaoPendente) {
            mensagem += `🔧 Produção pendente: ${itensProducao.length} item(ns)<br>`;
        }

        if (temCompraPendente) {
            mensagem += `🛒 Compras pendentes: ${itensCompra.length} item(ns)<br>`;
        }

        exibirModalAlertaPendencia(mensagem, 'separacao');
    } else {
        exibirModalFinalizacao(
            'Finalizar Separação',
            'Deseja finalizar a separação do pedido <strong>' + formatarCodigoSinprod(NR_PEDIDO),
            function () {
                finalizarProcesso(NR_PEDIDO, 22, baseURL + '/pedidos/listagem');
                atualizarTempoPedido(NR_PEDIDO, 1);
            }
        );
    }
}

function verificarConferenciaCompletaAntesFinalizar() {
    const table = $('#dataTable_ProdutosReservadosDoEstoque').DataTable();
    const allData = table.rows().data().toArray();

    let itensPendentes = [];
    let itensComProducaoPendente = [];
    let itensComCompraPendente = [];

    allData.forEach(item => {
        const qtdConferida = parseFloat(item.qtd_conferida?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
        const qtdSeparada = parseFloat(item.qtd_separada?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;

        if (qtdConferida < qtdSeparada) {
            itensPendentes.push({
                produto: item.produto,
                descricao: item.descricao,
                conferido: qtdConferida,
                separado: qtdSeparada
            });
        }

        if (qtdConferida > qtdSeparada) {
            itensPendentes.push({
                produto: item.produto,
                descricao: item.descricao,
                conferido: qtdConferida,
                separado: qtdSeparada,
                excedente: true
            });
        }
    });

    $.ajax({
        url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + NR_PEDIDO.replace('/', ''),
        type: "GET",
        data: {
            tipo_dados: 2
        },
        dataType: "json",
        success: function (responseRequisicao) {
            if (responseRequisicao.data && responseRequisicao.data.length > 0) {
                itensComProducaoPendente = responseRequisicao.data.filter(item => {
                    const saldoRequisicao = parseFloat(item.saldo_requisicao?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
                    return saldoRequisicao > 0;
                });
            }

            $.ajax({
                url: baseURL + "/pedidos-produtos/" + TIPO_ROTA + "/" + NR_PEDIDO.replace('/', ''),
                type: "GET",
                data: {
                    tipo_dados: 3
                },
                dataType: "json",
                success: function (responseCompra) {
                    if (responseCompra.data && responseCompra.data.length > 0) {
                        itensComCompraPendente = responseCompra.data.filter(item => {
                            const saldoOcp = parseFloat(item.saldo_ocp?.toString().replace(/\./g, '').replace(/,/g, '.')) || 0;
                            return saldoOcp > 0;
                        });
                    }

                    processarResultadoVerificacoesConferencia(itensPendentes, itensComProducaoPendente, itensComCompraPendente);
                },
                error: function () {
                    processarResultadoVerificacoesConferencia(itensPendentes, itensComProducaoPendente, []);
                }
            });
        },
        error: function () {
            processarResultadoVerificacoesConferencia(itensPendentes, [], []);
        }
    });
}

function processarResultadoVerificacoesConferencia(itensPendentes, itensProducao, itensCompra) {
    if (itensPendentes.length > 0) {
        let mensagem = 'Existem itens com divergência na conferência:<br><br>';
        itensPendentes.slice(0, 5).forEach(item => {
            mensagem += `• ${formatarCodigoProduto(item.produto)} - ${item.descricao.substring(0, 30)}...<br>`;
            if (item.excedente) {
                mensagem += `  <span class="text-danger">Conferido: ${item.conferido} (excede o separado: ${item.separado})</span><br>`;
            } else {
                mensagem += `  Conferido: ${item.conferido} de ${item.separado}<br>`;
            }
        });

        if (itensPendentes.length > 5) {
            mensagem += `... e mais ${itensPendentes.length - 5} itens.<br>`;
        }

        mensagem += '<br><span class="text-danger font-weight-bold">Finalização não permitida!</span>';

        showNotification('fas fa-exclamation-triangle', mensagem, 'warning', 8000);
        return;
    }

    const temProducaoPendente = itensProducao.length > 0;
    const temCompraPendente = itensCompra.length > 0;

    if (temProducaoPendente || temCompraPendente) {
        let mensagem = '';

        if (temProducaoPendente) {
            mensagem += `🔧 Produção pendente: ${itensProducao.length} item(ns)<br>`;
        }

        if (temCompraPendente) {
            mensagem += `🛒 Compras pendentes: ${itensCompra.length} item(ns)<br>`;
        }

        exibirModalAlertaPendencia(mensagem, 'conferencia');
    } else {
        exibirModalFinalizacao(
            'Finalizar Conferência',
            'Deseja finalizar a conferência do pedido <strong>' + formatarCodigoSinprod(NR_PEDIDO),
            function () {
                finalizarProcesso(NR_PEDIDO, 10, baseURL + '/pedidos/listagem');
                atualizarTempoPedido(NR_PEDIDO, 2);
            }
        );
    }
}

function finalizarProcesso(nrPedido, status, redirectUrl) {
    $('.btn-success').prop('disabled', true).addClass('loading');

    $.ajax({
        url: baseURL + "/pedidos/update-status",
        type: "POST",
        data: {
            nr_pedido: nrPedido.replace('/', ''),
            status_pedido: status
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            showNotification('fas fa-check-double', response.message, 'success', 900);

            setTimeout(function () {
                window.location.href = redirectUrl;
            }, 1000);
        },
        error: function (xhr) {
            $('.btn-success').prop('disabled', false).removeClass('loading');

            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                let errorMessages = Array.isArray(errors) ? errors : Object.values(errors).flat();
                showNotification('fas fa-bug', 'Erro: ' + errorMessages.join(', '), 'danger', 5000);
            } else {
                showNotification('fas fa-bug', 'Erro inesperado! Código: ' + xhr.status, 'danger', 5000);
            }
        }
    });
}

function atualizarTempoPedido(nrPedido, flTipo) {
    let message = "";

    switch (flTipo) {
        case 1:
            message = "Separação finalizada com sucesso!";
            break;

        case 2:
            message = "Conferência finalizada com sucesso!";
            break;
    }

    $.ajax({
        url: baseURL + "/pedidos-tempos/update",
        type: "POST",
        data: {
            nr_pedido: nrPedido.replace('/', ''),
            tipo: flTipo
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            showNotification('fas fa-check-double', message, 'success', 900);
        },
        error: function (xhr) {
            showNotification('fas fa-bug', 'Erro inesperado! Código: ' + xhr.responseJSON, 'danger', 5000);
        }
    });
}