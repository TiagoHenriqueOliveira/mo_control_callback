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
    $('#btn_iniciar_contagem').prop("disabled", false);
});

// modal contagem ciclica
$(document).on('click', '#btn_iniciar_contagem', function() {
    $('#modal_contagem_ciclica').modal({
        backdrop: 'static',
        focus: true
    });

    $('#modal_contagem_ciclica').on('shown.bs.modal', function () {
        $('#codigo_item').focus();
        $("#conf_id").val($("#conferentes").val());
        $("#set_id").val($("#setores").val());
    });
});

// restaura formulário para nova contagem ciclica
$(document).on('click', '#btn_novo', function() {
    $('#form_contagem_ciclica')[0].reset();
    $('#form_contagem_ciclica').find('button[type="submit"]').prop('disabled', false);
    $("#contagem_existente").addClass("d-none");
    $("#conf_id").val($("#conferentes").val());
    $('#codigo_item').focus();
    $("#codigo_item").prop("disabled", false);
    $("#qtd_item").prop("disabled", false);
    
});

// envia dados da contagem ciclica
$('#form_contagem_ciclica').submit(function (event) {
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
            $("#qtde_proprio").val(data.QUANTIDADE);
            $("#qtde_disponivel").val(data.QT_DISPONIVEL);
            
            $("#qtd_item").focus();

            // if ($("#fl_estagio").val() == "1") {
            //     getItemContado(data.CODIGO);
            // }
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
                $("#qtde_proprio").val(response.data[0].QUANTIDADE);
                $("#qtde_disponivel").val(response.data[0].QT_DISPONIVEL);

                $("#qtd_item").focus();

                // if ($("#fl_estagio").val() == "1") {
                //     getItemContado(response.data[0].CODIGO);
                // }
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