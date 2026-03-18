// Função para atualizar o estado do checkbox e o texto da label associada
function updateCheckbox(id, state, textActive, textDisable) {
    let checkbox = $('#' + id);
    let label = checkbox.next('label');

    checkbox.prop("checked", state);
    label.text(state ? textActive : textDisable);
}

// Função para atualizar o texto da label de acordo com o estado do checkbox
function updateTextLabelCheckbox(field, checkedText, uncheckedText) {
    $('#' + field).click(function () {
        if ($(this).attr('type') === 'checkbox') {
            let label = $(this).next('label');
            label.text(this.checked ? checkedText : uncheckedText);
        }
    });
}

// Função para exibir notificações na tela
function showNotification(icon, message, type, delay) {
    $.notify({
        icon: icon,
        message: message
    }, {
        type: type,
        delay: delay,
        z_index: 9999,
        placement: {
            from: "top",
            align: "center"
        }
    });
}

// Função para embaralhar um array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Faz um shuffle para ter cores aleatórias
function generateColors(labels, colorPalette) {
    let colorMap = {};
    let shuffledColors = shuffleArray([...colorPalette]);

    return labels.map((label, index) => {
        if (!colorMap[label]) {
            colorMap[label] = shuffledColors[index % shuffledColors.length]; // Garante uma cor única por label
        }
        return colorMap[label];
    });
}

// formata valores em JS
function formataValorJS(valor, decimais, dec_ponto, separador_milhar) {

    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    valor = (valor + '').replace(',', '').replace(' ', '');

    var n = !isFinite(+valor) ? 0 : +valor,
        prec = !isFinite(+decimais) ? 0 : Math.abs(decimais),
        sep = (typeof separador_milhar === 'undefined') ? '.' : separador_milhar,
        dec = (typeof dec_ponto === 'undefined') ? ',' : dec_ponto,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
}

// formata código sinprod
function formatarCodigoSinprod(codigo) {
    if (codigo === null || codigo === undefined || typeof codigo === 'object') {
        return `${codigo}`;
    }

    const numeroLimpo = `${codigo}`.replace(/\D/g, '');

    if (numeroLimpo.length === 10) {
        // Formato 0058402025 → 005840/2025
        return `${numeroLimpo.slice(0, 6)}/${numeroLimpo.slice(6)}`;
    } else if (numeroLimpo.length === 9) {
        // Formato 058982025 → 05898/2025
        return `${numeroLimpo.slice(0, 5)}/${numeroLimpo.slice(5)}`;
    }

    return `${codigo}`;
}

// Formata código de produto
function formatarCodigoProduto(codigo) {
    if (!codigo || codigo.trim() === '') {
        return '';
    }

    // Remove pontos existentes
    const codigoLimpo = codigo.toString().replace(/\./g, '');

    try {
        // Verifica se começa com zero
        if (codigoLimpo.startsWith('0')) {
            // Formato 2:3:3:X (ex: 01.002.108.34645)
            if (codigoLimpo.length >= 8) {
                const parte1 = codigoLimpo.substr(0, 2);
                const parte2 = codigoLimpo.substr(2, 3);
                const parte3 = codigoLimpo.substr(5, 3);
                const parte4 = codigoLimpo.substr(8);
                return `${parte1}.${parte2}.${parte3}.${parte4}`;
            }
        } else {
            // Formato 1:3:3:X (ex: 1.002.108.34645)
            if (codigoLimpo.length >= 7) {
                const parte1 = codigoLimpo.substr(0, 1);
                const parte2 = codigoLimpo.substr(1, 3);
                const parte3 = codigoLimpo.substr(4, 3);
                const parte4 = codigoLimpo.substr(7);
                return `${parte1}.${parte2}.${parte3}.${parte4}`;
            }
        }

        return codigoLimpo;
    } catch (e) {
        return codigoLimpo;
    }
}

// atualiza status do pedido
function updateStatusPedido(event, element) {
    event.preventDefault();

    let $element = $(element);
    let nr_pedido = $element.data('nr-pedido');
    let status_pedido = $element.data('status-pedido');
    let urlRedirect = $element.attr('href');

    $element.prop('disabled', true).addClass('loading');

    $.ajax({
        url: baseURL + "/pedidos/update-status",
        type: "POST",
        data: {
            nr_pedido: nr_pedido,
            status_pedido: status_pedido
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            showNotification('fas fa-check-double', response.message, 'success', 900);

            setTimeout(function () {
                window.location.href = urlRedirect;
            }, 1000);
        },
        error: function (xhr) {
            $element.prop('disabled', false).removeClass('loading');

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