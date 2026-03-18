$(document).ready(function() {
    configDataTableSetores();
});

// configuração da tabela que lista os setores
function configDataTableSetores() {
    $("#dataTable_Setores").DataTable({
        destroy: true,
        responsive: true,
        origin: false,
        pageLength: 25,
        "language": {
            "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
        },
        ajax: {
            url: baseURL + "/inventario/setores",
            type: "GET",
            dataSrc: "data"
        },
        columns: [
            { data: "acoes", orderable: false, searchable: false },
            { data: "descricao" },
            { data: "status" },
            { data: "ativo" }
        ],
        columnDefs: [
            { width: "5%", targets: 0 },
            { width: "45%", targets: 1 },
            { width: "30%", targets: 2 },
            { width: "20%", targets: 3 }
        ],
        "createdRow": function ( row, data, index ) {
            $('td', row).eq(0).addClass('text-center');
        },
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.ativo === "Desativado") {
                $('td', nRow).addClass("alert-danger");
            }
        }
    });
}

// abre modal dos setores e faz as devidas configurações
$(document).on('click', '.btn-modal-setor', function() {
    $('#modal_setor').modal({
        backdrop: 'static',
        focus: true
    });

    let id = $(this).data('id');
    let descricao = $(this).data('descricao');
    let status = $(this).data('status');
    let ativo = $(this).data('fl-ativo');

    $('#set_id').val(id);
    $('#set_descricao').val(descricao);
    $('#set_status').val(status);
    updateCheckbox("set_ativo", ativo === 1, "Ativo", "Desativado");

    $('#modal_setor').on('shown.bs.modal', function () {
        if ($('#set_id').val() === '') {
            $('#modal_setor_label').text('Novo Setor');
            $('#div_set_status').addClass("d-none");
            $('#div_set_ativo').addClass("d-none");
        } else {
            $('#modal_setor_label').text('Editar Setor');
            $('#div_set_status').removeClass("d-none");
            $('#div_set_ativo').removeClass("d-none");
        }

        $('#set_descricao').focus();
        updateTextLabelCheckbox("set_ativo", "Ativo", "Desativado");
    });
});

// envia dados do cadastro de setores
$('#form_setor').submit(function (event) {
    event.preventDefault();

    let form = $(this);
    let actionUrl = form.attr('action');
    let formData = form.serialize();

    form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
        url: actionUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function (response) {
            $("#modal_setor").modal("hide");
            $("#dataTable_Setores").DataTable().ajax.reload(null, false);
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

// reinicia todos os setores
$('#form_reiniciar_setores').submit(function (event) {
    event.preventDefault();

    let form = $(this);
    let actionUrl = form.attr('action');
    let formData = form.serialize();

    $.ajax({
        url: actionUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function (response) {
            $("#dataTable_Setores").DataTable().ajax.reload(null, false);
            showNotification('fas fa-check-double', response.message, 'success', 2000);
            form[0].reset();
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