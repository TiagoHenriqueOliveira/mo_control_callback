// bloqueia submit do formulário, libera somente o keypress no campo codigo_item
document.addEventListener('keypress', function(event) {
    if (event.target.id === 'codigo_item') {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }
});

// lista setores após escolher conferente
$(document).on('change', '#conferentes', function() {
    $('#div_setores').removeClass("d-none");
});

// controla botões após escolher o setor
$(document).on('change', '#setores', function() {
    let set_id = $("#setores").val();

    $.ajax({
        url: baseURL + "/inventario/buscar-status-setor",
        type: "GET",
        data: { set_id: set_id },
        dataType: "json",
        success: function (response) {
            $(".set_id").val(response.data.ID);
            $(".set_status").val(response.data.STATUS);

            switch (response.data.STATUS) {
                case 0: // setor livre
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 1: // iniciar contagem
                    $("#btn_iniciar_setor").prop("disabled", true);
                    $("#btn_finalizar_setor").removeClass("d-none");
                    $("#btn_contagem").removeClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 2: // contagem finalizada
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 3: // iniciar recontagem
                    $("#btn_iniciar_setor").prop("disabled", true);
                    $("#btn_finalizar_setor").removeClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").removeClass("d-none");
                    break;
            
                case 4: // recontagem finalizada
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 5: // conferencia supervisor contagem
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            }
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

// atualiza status ao iniciar a contagem do setor
$('#form_iniciar_setor').submit(function (event) {
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
            $(".set_id").val(response.data.ID);
            $(".set_status").val(response.data.STATUS);
            
            switch (response.data.STATUS) {
                case 1:
                    $("#btn_iniciar_setor").prop("disabled", true);
                    $("#btn_finalizar_setor").removeClass("d-none");
                    $("#btn_contagem").removeClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 3:
                    $("#btn_iniciar_setor").prop("disabled", true);
                    $("#btn_finalizar_setor").removeClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").removeClass("d-none");
                    break;
            }

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

// modal finalizar setor
$(document).on('click', '#btn_finalizar_setor', function() {
    $('#modal_finalizar').modal({
        backdrop: 'static',
        focus: true
    });

    $('.modal-header').removeClass('badge-primary');
    $('.modal-header').removeClass('badge-danger');
});

// atualiza status ao finalizar a contagem do setor
$('#form_finalizar_setor').submit(function (event) {
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
            let status = response.data.STATUS;
            
            switch (status) {
                case 2:
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            
                case 4:
                    $("#btn_iniciar_setor").prop("disabled", false);
                    $("#btn_finalizar_setor").addClass("d-none");
                    $("#btn_contagem").addClass("d-none");
                    $("#btn_recontagem").addClass("d-none");
                    break;
            }
            
            showNotification('fas fa-check-double', response.message, 'success', 2000);
            setTimeout(function () {
                location.reload();
            }, 1000);
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

// modal contagem
$(document).on('click', '#btn_contagem', function() {
    $('#modal_contagem_recontagem').modal({
        backdrop: 'static',
        focus: true
    });

    $('#modal_contagem_recontagem').on('shown.bs.modal', function () {
        $('.modal-header').removeClass('badge-danger');
        $('.modal-header').addClass('badge-primary');
        $('#modal_contagem_recontagem_label').text('Contagem');
        $('#codigo_item').focus();
        $('#fl_estagio').val(1);
        $("#set_id").val($("#setores").val());
        $("#conf_id").val($("#conferentes").val());
    });
});

// modal recontagem
$(document).on('click', '#btn_recontagem', function() {
    $('#modal_contagem_recontagem').modal({
        backdrop: 'static',
        focus: true
    });

    $('#modal_contagem_recontagem').on('shown.bs.modal', function () {
        $('.modal-header').removeClass('badge-primary');
        $('.modal-header').addClass('badge-danger');
        $('#modal_contagem_recontagem_label').text('Recontagem');
        $('#codigo_item').focus();
        $('#fl_estagio').val(2);
        $("#set_id").val($("#setores").val());
        $("#conf_id").val($("#conferentes").val());
    });
});

// restaura formulário para nova contagem
$(document).on('click', '#btn_novo', function() {
    $('#form_contagem_recontagem')[0].reset();
    $("#contagem_existente").addClass("d-none");
    $("#set_id").val($("#setores").val());
    $("#conf_id").val($("#conferentes").val());
    $("#codigo_item").prop("disabled", false);
    $('#codigo_item').focus();
    $("#qtd_item").prop("disabled", false);
    $('#form_contagem_recontagem').find('button[type="submit"]').prop('disabled', false);
});

// envia dados da contagem / recontagem / contagem ciclica
$('#form_contagem_recontagem').submit(function (event) {
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
            $("#codigo_item").prop("disabled", true);
            $("#qtd_item").prop("disabled", true);
            
            showNotification('fas fa-check-double', response.message, 'success', 2000);
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

// autocomplete para digitação manual do código
$("#codigo_item").autocomplete({
    minLength: 7,
    source: function(request, cb) {
        let codigo = request.term;

        $.ajax({
            url: baseURL + "/inventario/buscar-item",
            method: 'GET',
            data: { codigo: codigo },
            dataType: "json",
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function(response) {
                if (response.data.length) {
                    result = $.map(response.data, function(obj){
                        return {
                            label: obj.CODIGO,
                            value: obj.CODIGO,
                            data: obj
                        };
                    });
                }
                cb(result);
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
    },
    select: function(event, selectedData) {
        if (selectedData && selectedData.item && selectedData.item.data){
            var data = selectedData.item.data;

            $("#codigo_item").val(data.CODIGO);
            $("#descricao_item").val(data.DESCRICAO);
            $("#un_item").val(data.ABREVIATURA);
            
            $("#qtd_item").focus();

            if ($("#fl_estagio").val() == "1") {
                getItemContado(data.CODIGO);
            }
        }
    }
});

// busca o código no evento ENTER
$("#codigo_item").keypress(function(e) {
    let codigo = $("#codigo_item").val();

    if(e.which == 13) {
        $.ajax({
            url: baseURL + "/inventario/buscar-item",
            method: 'GET',
            data: { codigo: codigo },
            dataType: "json",
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function(response) {
                $("#codigo_item").val(response.data[0].CODIGO);
                $("#descricao_item").val(response.data[0].DESCRICAO);
                $("#un_item").val(response.data[0].ABREVIATURA);

                $("#qtd_item").focus();

                if ($("#fl_estagio").val() == "1") {
                    getItemContado(response.data[0].CODIGO);
                }
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
    }
});

// valida se o código já foi contado na contagem
function getItemContado(params) {
    let codigo = params;

    $.ajax({
        url: baseURL + "/inventario/buscar-item-contado",
        method: 'GET',
        data: { codigo: codigo },
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function(response) {
            if (response.data) {
                $("#contagem_existente").removeClass("d-none");
            }
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
}