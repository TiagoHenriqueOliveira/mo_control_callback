$(document).ready(function () {
    restaurarFiltros();
    configDataTablePedidos();

    setInterval(function () {
        if ($.fn.DataTable.isDataTable('#dataTable_ListaDePedidos')) {
            $('#dataTable_ListaDePedidos').DataTable().ajax.reload(null, false);

            showNotification(
                'fas fa-sync-alt',
                'Atualizando Lista de Pedidos',
                'info',
                2000
            );
        }
    }, 30000);
});

$('#btn_flt_pedidos').on('click', function () {
    salvarFiltros();
    configDataTablePedidos();
});

$('#flt_status_separacao_conferencia').on('change', function () {
    salvarFiltros();
    configDataTablePedidos();
});

// configuração da tabela que lista os pedidos
function configDataTablePedidos() {
    let ord_data = $("#flt_ord_datas").val();
    let status_reserva = $("#flt_status_reserva").val();
    let status_separacao_conferencia = $("#flt_status_separacao_conferencia").val();
    let dt_ini = $("#flt_dt_ini").val();
    let dt_fim = $("#flt_dt_fim").val();

    if (!dt_ini && !dt_fim) {
        showNotification('fas fa-exclamation-circle', 'Período informado é inválido!', 'warning', 5000);
    } else {
        $("#dataTable_ListaDePedidos").DataTable({
            destroy: true,
            responsive: true,
            ordering: false,
            pageLength: 25,
            stateSave: true,
            "language": {
                "url": 'https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese-Brasil.json'
            },
            ajax: {
                url: baseURL + "/pedidos/listagem",
                type: "GET",
                data: {
                    ord_data: ord_data,
                    status_reserva: status_reserva,
                    status_separacao_conferencia: status_separacao_conferencia,
                    dt_ini: dt_ini,
                    dt_fim: dt_fim
                },
                dataSrc: "data"
            },
            columns: [
                { data: "acoes", orderable: false, searchable: false },
                { data: "status" },
                { data: "pedido" },
                { data: "dt_pedido" },
                { data: "dt_entrega" },
                { data: "dt_despacho" },
                { data: "cliente" },
                { data: "cidade" },
                { data: "uf" },
                { data: "transportadora" },
                { data: "obs_interna" },
                { data: "carteira" }
            ],
            columnDefs: [
                { width: "6%", targets: 0 },
                { width: "12%", targets: 1 },
                { width: "7%", targets: 2 },
                { width: "7%", targets: 3 },
                { width: "7%", targets: 4 },
                { width: "7%", targets: 5 },
                { width: "15%", targets: 6 },
                { width: "8%", targets: 7 },
                { width: "2%", targets: 8 },
                { width: "10%", targets: 9 },
                { width: "13%", targets: 10 },
                { width: "6%", targets: 11 }
            ],
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                let statusCell = $('td', nRow).eq(1);
                let acoesCell = $('td', nRow).eq(0);

                statusCell.removeClass();
                acoesCell.find('.btn-separar, .btn-conferir, .btn-visualizar').hide();
                acoesCell.addClass("text-center");

                let status = String(aData.status).trim();

                switch (status) {
                    case "Liberado p/ Separação":
                        statusCell.addClass("status-lib-separacao font-weight-bold");
                        acoesCell.find('.btn-separar, .btn-visualizar').show();
                        break;
                    case "Em Separação":
                        statusCell.addClass("status-em-separacao font-weight-bold");
                        acoesCell.find('.btn-separar, .btn-visualizar').show();
                        break;
                    case "Liberado p/ Conferência":
                        statusCell.addClass("status-lib-conferencia font-weight-bold");
                        acoesCell.find('.btn-conferir').show();
                        break;
                    case "Em Conferência":
                        statusCell.addClass("status-em-conferencia font-weight-bold");
                        acoesCell.find('.btn-conferir').show();
                        break;
                    case "Parc. Faturado":
                        statusCell.addClass("status-parc-faturado font-weight-bold");
                        acoesCell.find('.btn-separar, .btn-visualizar').show();
                        break;
                }
            }
        });
    }
}

function salvarFiltros() {
    const filtros = {
        flt_ord_datas: $('#flt_ord_datas').val(),
        flt_status_reserva: $('#flt_status_reserva').val(),
        flt_status_separacao_conferencia: $('#flt_status_separacao_conferencia').val(),
        flt_dt_ini: $('#flt_dt_ini').val(),
        flt_dt_fim: $('#flt_dt_fim').val()
    };

    localStorage.setItem('filtros_pedidos', JSON.stringify(filtros));
}

function restaurarFiltros() {
    const filtrosSalvos = localStorage.getItem('filtros_pedidos');

    if (filtrosSalvos) {
        try {
            const filtros = JSON.parse(filtrosSalvos);

            $('#flt_ord_datas').val(filtros.flt_ord_datas !== undefined ? filtros.flt_ord_datas : '1');
            $('#flt_status_reserva').val(filtros.flt_status_reserva !== undefined ? filtros.flt_status_reserva : '1');
            $('#flt_status_separacao_conferencia').val(filtros.flt_status_separacao_conferencia !== undefined ? filtros.flt_status_separacao_conferencia : '0');
            $('#flt_dt_ini').val(filtros.flt_dt_ini || "{{ now()->subDays(120)->format('Y-m-d') }}");
            $('#flt_dt_fim').val(filtros.flt_dt_fim || "{{ now()->format('Y-m-d') }}");

            return true;
        } catch (e) {
            restaurarPadroes();
            return false;
        }
    } else {
        restaurarPadroes();
        return false;
    }
}

function restaurarPadroes() {
    $('#flt_ord_datas').val('1');
    $('#flt_status_reserva').val('1');
    $('#flt_status_separacao_conferencia').val('0');
    $('#flt_dt_ini').val("{{ now()->subDays(120)->format('Y-m-d') }}");
    $('#flt_dt_fim').val("{{ now()->format('Y-m-d') }}");
}