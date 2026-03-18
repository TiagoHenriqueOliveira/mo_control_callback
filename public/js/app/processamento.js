// carrega os itens conferidos e prepara para o processamento
$(document).on('click', '#btn_buscar', function() {
    let flt_mes = $("#flt_mes").val();
    let flt_ano = $("#flt_ano").val();

    if (!flt_mes && !flt_ano) {
        showNotification('fas fa-exclamation-circle', 'O mês e ano são obrigatórios!', 'warning', 5000);
    } else {
        $("#observacoes").prop("disabled", false);
        $("#btn_processar").prop("disabled", false);

        $("#dataTable_Processamentos").DataTable({
            destroy: true,
            responsive: true,
            ordering: false,
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
                url: baseURL + "/inventario/processamentos",
                type: "GET",
                data: {
                    mes: flt_mes,
                    ano: flt_ano
                },
                dataSrc: "data"
            },
            columns: [
                { data: "codigo" },
                { data: "descricao" },
                { data: "unidade" },
                { data: "local_estoque" },
                { data: "estoque_atual" },
                { data: "contagem" },
                { data: "diferenca" },
                { data: "status" },
                { data: "processado" }
            ],
            columnDefs: [
                { width: "8%", targets: 0 },
                { width: "39%", targets: 1 },
                { width: "2%", targets: 2 },
                { width: "12%", targets: 3 },
                { width: "8%", targets: 4 },
                { width: "8%", targets: 5 },
                { width: "8%", targets: 6 },
                { width: "10%", targets: 7 },
                { width: "5%", targets: 8 }
            ],
            "createdRow": function ( row, data, index ) {
                $('td', row).eq(0).mask("#.###.###.######");
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if(aData.status === "Saída") {
                    $('td', nRow).addClass("alert-warning");
                } else if (aData.status === "Entrada") {
                    $('td', nRow).addClass("alert-success");
                } else if (aData.status === "Sem Ocorrência") {
                    $('td', nRow).addClass("alert-primary");
                }
				
				if (aData.diferenca_e_r != "0,000") {
					$('td', nRow).eq(10).addClass("font-weight-bolder text-danger");
				}
            }
        });
    }
});

$(document).on('click', '#btn_processar', function() {
    if (!$('#observacoes').val()) {
        showNotification('fas fa-exclamation-circle', 'O campo <span class="font-weight-bolder text-danger">Observações</span> é obrigatório!', 'warning', 5000);
        return;
    }

    $('#modal_processamento').modal({
        backdrop: 'static',
        focus: true
    });
});

$('#form_processamento').submit(function (event) {
    event.preventDefault();

    let form = $(this);
    let actionUrl = form.attr('action');
    let flt_mes = $("#flt_mes").val();
    let flt_ano = $("#flt_ano").val();
    let supervisor = $("#supervisores").val();
    let observacoes = $("#observacoes").val();

    form.find('button[type="submit"]').prop('disabled', true);
    $("#modal_processamento").modal("hide");

    let progress = 0;
    let progressBar = $(".progress-bar");
    let loadingComplete = false;

    $(".progress").removeClass("d-none");

    let progressInterval = setInterval(function () {
        if (progress < 99) {
            progress += 10;
            progressBar.css("width", progress + "%").text(progress + "%");
        }
    }, 500);

    $.ajax({
        url: actionUrl,
        type: "POST",
        data: {
            mes: flt_mes,
            ano: flt_ano,
            supervisor: supervisor,
            observacoes: observacoes
        },
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function (response) {
            loadingComplete = true;

            progress = 100;
            progressBar.css("width", progress + "%").text(progress + "%");

            $("#observacoes").val("");
            $("#btn_processar").prop('disabled', true);

            form.find('button[type="submit"]').prop('disabled', false);

            setTimeout(function () {
                clearInterval(progressInterval);
                $(".progress").addClass("d-none");
                $(".spinner-grow").addClass("d-none");

                $("#dataTable_Processamentos").DataTable().ajax.reload(null, false);

                showNotification('fas fa-check-double', response.message, 'success', 2000);
            }, 1000);
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

    let checkAjaxCompletion = setInterval(function () {
        if (loadingComplete) {
            clearInterval(checkAjaxCompletion);
        }
    }, 500);
});