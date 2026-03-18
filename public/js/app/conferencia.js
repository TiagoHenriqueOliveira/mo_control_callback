$(document).ready(function() {
    configDataTableConferenciasItensNaoContados();
    configDataTableConferenciasItensContadosCiclico();
});

// configuração da tabela que lista os itens contados
function configDataTableConferenciasItensContados() {
    let flt_mes = $("#flt_mes").val();
    let flt_ano = $("#flt_ano").val();
    let flt_status = $("#flt_status_processado").val();
    let flt_setor = $("#flt_setor").val();

    if (!flt_mes && !flt_ano) {
        showNotification('fas fa-exclamation-circle', 'O mês e ano são obrigatórios!', 'warning', 5000);
    } else {
        $("#dataTable_Contados").DataTable({
            destroy: true,
            responsive: true,
            ordering: true,
            stateSave: true,
            pageLength: 30,
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'excel', className: 'btn btn-secondary' }
                ]
            },
            "language": {
                "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
            },
            ajax: {
                url: baseURL + "/inventario/itens-contados",
                type: "GET",
                data: {
                    mes: flt_mes,
                    ano: flt_ano,
                    status: flt_status,
                    setor: flt_setor
                },
                dataSrc: "data"
            },
            columns: [
                { data: "acoes", orderable: false, searchable: false },
                { data: "setor" },
                { data: "codigo" },
                { data: "descricao" },
                { data: "unidade" },
                { data: "local_estoque" },
                { data: "estoque_atual" },
                { data: "contagem" },
                { data: "recontagem" },
                { data: "diferenca_c_r" },
                { data: "diferenca_e_r" },
                { data: "conferente_1" },
                { data: "conferente_2" },
                { data: "status" }
            ],
            columnDefs: [
                { width: "1%", targets: 0 },
                { width: "10%", targets: 1 },
                { width: "5%", targets: 2 },
                { width: "15%", targets: 3 },
                { width: "2%", targets: 4 },
                { width: "4%", targets: 5 },
                { width: "7%", targets: 6 },
                { width: "7%", targets: 7 },
                { width: "7%", targets: 8 },
                { width: "7%", targets: 9 },
                { width: "7%", targets: 10 },
                { width: "12%", targets: 11 },
                { width: "12%", targets: 12 },
                { width: "4%", targets: 13 }
            ],
            "createdRow": function ( row, data, index ) {
                $('td', row).eq(0).addClass("text-center");
                $('td', row).eq(2).mask("#.###.###.######");
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if(aData.contagem != aData.recontagem) {
                    $('td', nRow).addClass("alert-danger");
                } else if ((aData.estoque_atual != aData.contagem) && (aData.estoque_atual != aData.recontagem)) {
                    $('td', nRow).addClass("alert-warning");
                } else if ((aData.estoque_atual == aData.contagem) && (aData.estoque_atual == aData.recontagem)) {
                    $('td', nRow).addClass("alert-success");
                }
				
				if (aData.diferenca_e_r != "0,000") {
					$('td', nRow).eq(10).addClass("font-weight-bolder text-danger");
				}
            }
        });
    }    
}

// configuração da tabela que lista os itens ciclicos contados
function configDataTableConferenciasItensContadosCiclico() {
    let flt_mes = $("#flt_mes").val();
    let flt_ano = $("#flt_ano").val();
    let flt_status = $("#flt_status_conferido").val();
    let flt_setor = $("#flt_setor").val();

    if (!flt_mes && !flt_ano) {
        showNotification('fas fa-exclamation-circle', 'O mês e ano são obrigatórios!', 'warning', 5000);
    } else {
        $("#dataTable_Contados_Ciclico").DataTable({
            destroy: true,
            responsive: true,
            ordering: true,
            stateSave: true,
            pageLength: 30,
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'excel', className: 'btn btn-secondary' }
                ]
            },
            "language": {
                "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
            },
            ajax: {
                url: baseURL + "/inventario/itens-contados-ciclico",
                type: "GET",
                data: {
                    mes: flt_mes,
                    ano: flt_ano,
                    status: flt_status,
                    setor: flt_setor
                },
                dataSrc: "data"
            },
            columns: [
                { data: "acoes", orderable: false, searchable: false },
                { data: "setor" },
                { data: "codigo" },
                { data: "descricao" },
                { data: "unidade" },
                { data: "local_estoque" },
                { data: "estoque_atual" },
                { data: "contagem" },
                { data: "diferenca_e_c" },
                { data: "conferente_1" },
                { data: "status" }
            ],
            columnDefs: [
                { width: "1%", targets: 0 },
                { width: "12%", targets: 1 },
                { width: "5%", targets: 2 },
                { width: "17%", targets: 3 },
                { width: "2%", targets: 4 },
                { width: "4%", targets: 5 },
                { width: "10%", targets: 6 },
                { width: "10%", targets: 7 },
                { width: "10%", targets: 8 },
                { width: "15%", targets: 9 },
                { width: "14%", targets: 10 },
            ],
            "createdRow": function ( row, data, index ) {
                $('td', row).eq(0).addClass("text-center");
                $('td', row).eq(1).addClass("text-center");
                $('td', row).eq(2).mask("#.###.###.######");
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if(aData.estoque_atual != aData.contagem) {
                    $('td', nRow).addClass("alert-warning");
                } else if (aData.estoque_atual == aData.contagem) {
                    $('td', nRow).addClass("alert-info");
                }
            }
        });
    }    
}

// configuração da tabela que lista os itens não contados
function configDataTableConferenciasItensNaoContados() {
    let flt_mes = $("#flt_mes").val();
    let flt_ano = $("#flt_ano").val();
    let flt_classe = $("#flt_classes").val();

    if (!flt_mes && !flt_ano) {
        showNotification('fas fa-exclamation-circle', 'O mês e ano são obrigatórios!', 'warning', 5000);
    } else {
        $("#dataTable_Nao_Contados").DataTable({
            destroy: true,
            responsive: true,
            ordering: true,
            stateSave: true,
            searching: false,
            pageLength: 30,
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'excel', className: 'btn btn-secondary' }
                ]
            },
            "language": {
                "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
            },
            ajax: {
                url: baseURL + "/inventario/itens-nao-contados",
                type: "GET",
                data: {
                    mes: flt_mes,
                    ano: flt_ano,
                    classe: flt_classe
                },
                dataSrc: "data"
            },
            columns: [
                { data: "codigo" },
                { data: "descricao" },
                { data: "unidade" },
                { data: "local_estoque" },
                { data: "estoque_atual" }
            ],
            "createdRow": function ( row, data, index ) {
                $('td', row).eq(0).mask("#.###.###.######");
            }
        });
    }    
}

// quando alterado a classe carrega os itens não contados conforme a escolha
$(document).on('change', '#flt_classes', function() {
    configDataTableConferenciasItensNaoContados();
});

// modal conferências
$(document).on('click', '.btn-modal-conferencia', function() {
    $('#modal_conferencia').modal({
        backdrop: 'static',
        focus: true
    });

    let id = $(this).data('id');
    let codigo = $(this).data('codigo');
    let descricao = $(this).data('descricao');
    let unidade = $(this).data('unidade');
    let contagem = $(this).data('qtde-contagem');
    let recontagem = $(this).data('qtde-recontagem');

    $('#modal_conferencia').on('shown.bs.modal', function () {
        $('#qtd_contagem').focus();
        $("#id_contagem").val(id);
        $("#codigo_item").val(codigo).mask("#.###.###.######").trigger('input');
        $("#descricao_item").val(descricao);
        $("#un_item").val(unidade);
        $("#qtd_contagem").val(contagem);
        $("#qtd_recontagem").val(recontagem);
    });
});

// atualiza quantidades da contagem / recontagem
$('#form_conferencia').submit(function (event) {
    event.preventDefault();

    let form = $(this);
    let actionUrl = form.attr('action');

    form.find('input.numeric').each(function () {
        let valor = $(this).val();
        valor = valor.replace(/\./g, '').replace(/,/g, '.');
        $(this).val(valor);
    });

    let formData = form.serialize();

    form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
        url: actionUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function (response) {
            $("#dataTable_Contados").DataTable().ajax.reload(null, false);
            $("#modal_conferencia").modal("hide");
            showNotification('fas fa-check-double', response.message, 'success', 2000);
            form[0].reset();
            form.find('button[type="submit"]').prop('disabled', false);
        },
        error: function (xhr) {
            form.find('button[type="submit"]').prop('disabled', false);

            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                let errorMessages = '<ul>';
                $.each(errors, function (key, messages) {
                    $.each(messages, function (index, message) {
                        errorMessages += '<li>' + message + '</li>';
                    });
                });
                errorMessages += '</ul>';
                showNotification('fas fa-bug', 'Ocorreram erros ao salvar o registro:<br>' + errorMessages, 'danger', 5000);
            } else {
                showNotification('fas fa-bug', 'Ops... um erro inesperado ocorreu! Código: ' + xhr.status, 'danger', 5000);
            }
        }
    });
});

// item conferido
$(document).on('click', '.btn-conferido', function() {
    let id_contagem = $(this).data('id');

    $.ajax({
        url: baseURL + "/inventario/atualizar-item-conferido",
        type: "POST",
        data: {
            id_contagem: id_contagem
        },
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function (response) {
            $("#dataTable_Contados_Ciclico").DataTable().ajax.reload(null, false);
            showNotification('fas fa-check-double', response.message, 'success', 2000);
        },
        error: function (xhr) {
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                let errorMessages = '<ul>';
                $.each(errors, function (key, messages) {
                    $.each(messages, function (index, message) {
                        errorMessages += '<li>' + message + '</li>';
                    });
                });
                errorMessages += '</ul>';
                showNotification('fas fa-bug', 'Ocorreram erros ao salvar o registro:<br>' + errorMessages, 'danger', 5000);
            } else {
                showNotification('fas fa-bug', 'Ops... um erro inesperado ocorreu! Código: ' + xhr.status, 'danger', 5000);
            }
        }
    });
});