$(document).ready(function () {
    buttonsColors();
    progressaoDaContagem();
    itensNaoContadosPorClasse();
    itensDivergentesContagemRecontagemPorClasse();
    itensDivergentesEstoqueProprioContagemPorClasse();
    itensComOcorrenciaPorClasse();
    itensComOcorrenciaGeral();
    progressaoDosSetores();
    statusDosSetores();
});

const colors = [
    '#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#FF6348',
    '#5352ED', '#FF7F50', '#00CED1', '#FFD700', '#DA70D6',
    '#32CD32', '#FF69B4', '#4169E1', '#FF8C00', '#9370DB',
    '#3CB371', '#FF4500', '#6A5ACD', '#20B2AA', '#DE3163',
    '#6495ED', '#DC143C', '#00BFFF', '#FF1493', '#7CFC00'
];

var myBarChartProgressaoContagem = null;
var myPieChartItensNaoContadosPorClasse = null;
var myLineChartItensDivergentesContagemRecontagemPorClasse = null;
var myLineChartItensDivergentesEstoqueProprioContagemPorClasse = null;
var myLineChartItensComOcorrenciaPorClasse = null;
var myLineChartItensComOcorrenciaGeral = null;
var myBarHorizonChartProgressaoSetores = null;
var myPieChartStatusDosSetores = null;

function buttonsColors() {
    $("#div_button_setores button").each(function () {
        let status = $(this).data("status");

        switch (status) {
            case 0:
                $(this).addClass("btn-success");
                break;

            case 1:
                $(this).removeClass("btn-success");
                $(this).addClass("btn-primary");
                break;

            case 2:
                $(this).removeClass("btn-primary");
                $(this).addClass("btn-navy-blue");
                break;

            case 3:
                $(this).removeClass("btn-navy-blue");
                $(this).addClass("btn-danger");
                break;

            case 4:
                $(this).removeClass("btn-danger");
                $(this).addClass("btn-violet");
                break;

            case 5:
                $(this).removeClass("btn-violet");
                $(this).addClass("btn-lime-green");
                break;

            case 6:
                $(this).removeClass("btn-lime-green");
                $(this).addClass("btn-gold");
                break;
        }
    });
}

$(document).on('click', '#btn_supervisor', function () {
    let id = $(this).data('id');
    let status = $(this).data('status');

    if (status === 2 || status === 4) {
        $('#modal_supervisor').modal({
            focus: true
        });

        $('#set_id').val(id);
        $('#set_status').val(status);
    } else {
        showNotification('fas fa-exclamation-circle', 'Status do setor inválido!', 'warning', 5000);
        return;
    }
});

$('#form_supervisor_setor').submit(function (event) {
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
            $("#modal_supervisor").modal("hide");
            location.reload();
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

function progressaoDaContagem() {
    var mes = $("#mes_progress_count").val();
    var ano = $("#ano_progress_count").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/progressao-da-contagem",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                if ($("#progress_count").get(0)) {
                    var ctx = $("#progress_count").get(0).getContext("2d");

                    var cores = generateColors(data.desc_classe, colors);

                    if (myBarChartProgressaoContagem !== null) {
                        myBarChartProgressaoContagem.destroy();
                    }

                    myBarChartProgressaoContagem = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.desc_classe,
                            datasets: [{
                                fill: false,
                                lineTension: 0.3,
                                backgroundColor: cores,
                                borderColor: cores,
                                label: "Itens Não Contados",
                                data: data.qtd_nao_contada
                            }, {
                                fill: false,
                                lineTension: 0.3,
                                backgroundColor: cores,
                                borderColor: cores,
                                label: "Itens Contados",
                                data: data.qtd_contada
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: { display: true, fontSize: 14, text: "Progressão da Contagem (Estoque > 0)" },
                            legend: { display: false, position: "bottom" },
                            plugins: { datalabels: false, },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        padding: 10,
                                        callback: function (value, index, values) {
                                            return value;
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(224, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: true,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }],
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.datasets[tooltipItems[0].datasetIndex].label;
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var dataIndex = tooltipItem.index;
                                        var valor = Number(dataset.data[dataIndex]) || 0;

                                        var totalClasse = 0;
                                        chart.datasets.forEach(function (ds) {
                                            totalClasse += Number(ds.data[dataIndex]) || 0;
                                        });

                                        let percentual;
                                        if (!totalClasse || totalClasse === 0 || isNaN(totalClasse)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalClasse) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        return valor + " (" + percentual + ")";
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function itensNaoContadosPorClasse() {
    var mes = $("#mes_itens_not_count_for_class").val();
    var ano = $("#ano_itens_not_count_for_class").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/itens-nao-contados-por-classe",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                if ($("#itens_nao_contados_por_classe").get(0)) {
                    var ctx = $("#itens_nao_contados_por_classe").get(0).getContext("2d");

                    var cores = generateColors(data.desc_classe, colors);

                    if (myPieChartItensNaoContadosPorClasse !== null) {
                        myPieChartItensNaoContadosPorClasse.destroy();
                    }

                    myPieChartItensNaoContadosPorClasse = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: data.desc_classe,
                            datasets: [{
                                backgroundColor: cores,
                                borderColor: '#fff',
                                borderWidth: 2,
                                label: "Qtde",
                                data: data.qtd_nao_contada
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: {
                                display: true,
                                fontSize: 14,
                                text: "Itens Não Contados (Estoque > 0)"
                            },
                            legend: {
                                display: true,
                                position: "left",
                                labels: {
                                    padding: 15,
                                    boxWidth: 12
                                }
                            },
                            plugins: {
                                datalabels: false
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: true,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.labels[tooltipItems[0].index];
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var valor = Number(dataset.data[tooltipItem.index]) || 0;

                                        var totalGeral = dataset.data.reduce(function (a, b) {
                                            return (Number(a) || 0) + (Number(b) || 0);
                                        }, 0);

                                        let percentual;
                                        if (!totalGeral || totalGeral === 0 || isNaN(totalGeral)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalGeral) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        return dataset.label + ": " + valor + " (" + percentual + ")";
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function itensComOcorrenciaGeral() {
    var mes = $("#mes_itens_occurrence_geral").val();
    var ano = $("#ano_itens_occurrence_geral").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/itens-com-ocorrencia-geral",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                console.log("Dados recebidos:", data); // DEBUG - verifique no console

                if ($("#itens_occurrence_geral").get(0)) {
                    var ctx = $("#itens_occurrence_geral").get(0).getContext("2d");

                    // Cores específicas para cada tipo de ocorrência
                    var cores = ['#4442c1ff', '#20c9c0ff', '#fdbf14ff']; // Sem Ocorrência, Entrada, Saída

                    if (window.myPieChartItensComOcorrenciaGeral !== null && window.myPieChartItensComOcorrenciaGeral !== undefined) {
                        window.myPieChartItensComOcorrenciaGeral.destroy();
                    }

                    // CORREÇÃO: Use os valores diretamente, não precisa de reduce
                    var totalSemOcorrencia = data.sem_ocorrencia || 0;
                    var totalEntrada = data.entrada || 0;
                    var totalSaida = data.saida || 0;

                    console.log("Totais:", { // DEBUG
                        sem_ocorrencia: totalSemOcorrencia,
                        entrada: totalEntrada,
                        saida: totalSaida
                    });

                    window.myPieChartItensComOcorrenciaGeral = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ["Sem Ocorrência", "Entradas", "Saídas"],
                            datasets: [{
                                backgroundColor: cores,
                                borderColor: '#fff',
                                borderWidth: 2,
                                label: "Quantidade",
                                data: [totalSemOcorrencia, totalEntrada, totalSaida]
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: {
                                display: true,
                                fontSize: 14,
                                text: "Distribuição de Ocorrências no Estoque"
                            },
                            legend: {
                                display: true,
                                position: "left",
                                labels: {
                                    padding: 15,
                                    boxWidth: 12,
                                    fontStyle: 'bold'
                                }
                            },
                            plugins: {
                                datalabels: false
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: true,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.labels[tooltipItems[0].index];
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var valor = Number(dataset.data[tooltipItem.index]) || 0;

                                        var totalGeral = dataset.data.reduce(function (a, b) {
                                            return (Number(a) || 0) + (Number(b) || 0);
                                        }, 0);

                                        let percentual;
                                        if (!totalGeral || totalGeral === 0 || isNaN(totalGeral)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalGeral) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        return "Quantidade: " + valor + " (" + percentual + ")";
                                    }
                                }
                            }
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na requisição:", error); // DEBUG
                showNotification('fas fa-exclamation-triangle', 'Erro ao carregar dados do gráfico!', 'danger', 5000);
            }
        });
    }
}

function itensDivergentesContagemRecontagemPorClasse() {
    var mes = $("#mes_itens_divergents_for_class").val();
    var ano = $("#ano_itens_divergents_for_class").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/itens-divergentes-por-classe",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                if ($("#itens_divergentes_por_classe").get(0)) {
                    var ctx = $("#itens_divergentes_por_classe").get(0).getContext("2d");

                    var totalPorClasse = data.qtd_correta.map(function (val, index) {
                        return val + data.qtd_divergente[index];
                    });

                    if (myLineChartItensDivergentesContagemRecontagemPorClasse !== null) {
                        myLineChartItensDivergentesContagemRecontagemPorClasse.destroy();
                    }

                    myLineChartItensDivergentesContagemRecontagemPorClasse = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.desc_classe,
                            datasets: [{
                                label: "Total de Itens",
                                data: totalPorClasse,
                                backgroundColor: '#6f42c1',
                                borderColor: '#6f42c1',
                                borderWidth: 3,
                                borderDash: [5, 5],
                                fill: false,
                                tension: 0.3,
                                pointBackgroundColor: '#6f42c1',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8
                            }, {
                                label: "Corretos",
                                data: data.qtd_correta,
                                backgroundColor: '#28a745',
                                borderColor: '#28a745',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#28a745',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }, {
                                label: "Divergentes",
                                data: data.qtd_divergente,
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#dc3545',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: {
                                display: true,
                                fontSize: 14,
                                text: "Itens Corretos vs Divergentes"
                            },
                            legend: {
                                display: true,
                                position: "bottom",
                                labels: {
                                    padding: 15,
                                    boxWidth: 12,
                                    fontStyle: 'bold'
                                }
                            },
                            plugins: {
                                datalabels: false
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.1)"
                                    },
                                    ticks: {
                                        maxRotation: 45,
                                        minRotation: 45
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        min: 0,
                                        padding: 10,
                                        callback: function (value) {
                                            return value;
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(224, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: true,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: true,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.labels[tooltipItems[0].index];
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var valor = Number(dataset.data[tooltipItem.index]) || 0;
                                        var totalClasse = totalPorClasse[tooltipItem.index];

                                        let percentual;
                                        if (!totalClasse || totalClasse === 0 || isNaN(totalClasse)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalClasse) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        if (dataset.label === "Total de Itens") {
                                            return dataset.label + ": " + valor;
                                        } else {
                                            var percentualTotal = totalClasse > 0 ? ((valor / totalClasse) * 100).toFixed(2).replace('.', ',') + "%" : "0,00%";
                                            return dataset.label + ": " + valor + " (" + percentualTotal + " do total)";
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function itensDivergentesEstoqueProprioContagemPorClasse() {
    var mes = $("#mes_itens_divergents_2_for_class").val();
    var ano = $("#ano_itens_divergents_2_for_class").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/itens-divergentes-2-por-classe",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                if ($("#itens_divergentes_2_por_classe").get(0)) {
                    var ctx = $("#itens_divergentes_2_por_classe").get(0).getContext("2d");

                    var totalPorClasse = data.sem_acerto.map(function (val, index) {
                        return val + data.com_acerto[index];
                    });

                    if (myLineChartItensDivergentesEstoqueProprioContagemPorClasse !== null) {
                        myLineChartItensDivergentesEstoqueProprioContagemPorClasse.destroy();
                    }

                    myLineChartItensDivergentesEstoqueProprioContagemPorClasse = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.desc_classe,
                            datasets: [{
                                label: "Total de Itens",
                                data: totalPorClasse,
                                backgroundColor: '#6f42c1',
                                borderColor: '#6f42c1',
                                borderWidth: 3,
                                borderDash: [5, 5],
                                fill: false,
                                tension: 0.3,
                                pointBackgroundColor: '#6f42c1',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8
                            }, {
                                label: "Sem Acerto",
                                data: data.sem_acerto,
                                backgroundColor: '#20c997',
                                borderColor: '#20c997',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#20c997',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }, {
                                label: "Com Acerto",
                                data: data.com_acerto,
                                backgroundColor: '#fd7e14',
                                borderColor: '#fd7e14',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#fd7e14',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: {
                                display: true,
                                fontSize: 14,
                                text: "Itens Sem Acerto vs Com Acerto de Estoque"
                            },
                            legend: {
                                display: true,
                                position: "bottom",
                                labels: {
                                    padding: 15,
                                    boxWidth: 12,
                                    fontStyle: 'bold'
                                }
                            },
                            plugins: {
                                datalabels: false
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.1)"
                                    },
                                    ticks: {
                                        maxRotation: 45,
                                        minRotation: 45
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        min: 0,
                                        padding: 10,
                                        callback: function (value) {
                                            return value;
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(224, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: true,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: true,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.labels[tooltipItems[0].index];
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var valor = Number(dataset.data[tooltipItem.index]) || 0;
                                        var totalClasse = totalPorClasse[tooltipItem.index];

                                        let percentual;
                                        if (!totalClasse || totalClasse === 0 || isNaN(totalClasse)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalClasse) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        if (dataset.label === "Total de Itens") {
                                            return dataset.label + ": " + valor;
                                        } else {
                                            var percentualTotal = totalClasse > 0 ? ((valor / totalClasse) * 100).toFixed(2).replace('.', ',') + "%" : "0,00%";
                                            return dataset.label + ": " + valor + " (" + percentualTotal + " do total)";
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function itensComOcorrenciaPorClasse() {
    var mes = $("#mes_itens_occurrence_for_class").val();
    var ano = $("#ano_itens_occurrence_for_class").val();

    if (!mes || !ano) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else if ((mes < 1 || mes > 12) || (ano < 1900 || ano > 9999)) {
        showNotification('fas fa-exclamation-triangle', 'Ops... mês ou ano inválidos!', 'warning', 5000);
        return;
    } else {
        $.ajax({
            url: baseURL + "/inventario/dashboard/itens-com-ocorrencia-por-classe",
            type: "get",
            data: { mes: mes, ano: ano },
            dataType: "json",
            success: function (data) {
                if ($("#itens_occurrence_por_classe").get(0)) {
                    var ctx = $("#itens_occurrence_por_classe").get(0).getContext("2d");

                    if (myLineChartItensComOcorrenciaPorClasse !== null) {
                        myLineChartItensComOcorrenciaPorClasse.destroy();
                    }

                    myLineChartItensComOcorrenciaPorClasse = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.desc_classe,
                            datasets: [{
                                label: "Sem Ocorrência",
                                data: data.sem_ocorrencia,
                                backgroundColor: '#4442c1ff',
                                borderColor: '#4442c1ff',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#4442c1ff',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }, {
                                label: "Entradas",
                                data: data.entrada,
                                backgroundColor: '#20c9c0ff',
                                borderColor: '#20c9c0ff',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#20c9c0ff',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }, {
                                label: "Saída",
                                data: data.saida,
                                backgroundColor: '#fdbf14ff',
                                borderColor: '#fdbf14ff',
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: '#fdbf14ff',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }]
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                            title: {
                                display: true,
                                fontSize: 14,
                                text: "Itens Sem Ocorrência vs Entradas vs Saídas do Estoque"
                            },
                            legend: {
                                display: true,
                                position: "bottom",
                                labels: {
                                    padding: 15,
                                    boxWidth: 12,
                                    fontStyle: 'bold'
                                }
                            },
                            plugins: {
                                datalabels: false
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.1)"
                                    },
                                    ticks: {
                                        maxRotation: 45,
                                        minRotation: 45
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        min: 0,
                                        padding: 10,
                                        callback: function (value) {
                                            return value;
                                        }
                                    },
                                    gridLines: {
                                        color: "rgb(224, 236, 244)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: true,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2]
                                    }
                                }]
                            },
                            tooltips: {
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: true,
                                callbacks: {
                                    title: function (tooltipItems, data) {
                                        return data.labels[tooltipItems[0].index];
                                    },
                                    label: function (tooltipItem, chart) {
                                        var dataset = chart.datasets[tooltipItem.datasetIndex];
                                        var valor = Number(dataset.data[tooltipItem.index]) || 0;

                                        // Calcula o total da classe somando todos os datasets
                                        var totalClasse = 0;
                                        chart.datasets.forEach(function (ds) {
                                            totalClasse += Number(ds.data[tooltipItem.index]) || 0;
                                        });

                                        let percentual;
                                        if (!totalClasse || totalClasse === 0 || isNaN(totalClasse)) {
                                            percentual = valor > 0 ? "100,00%" : "0,00%";
                                        } else {
                                            let percentualNum = (valor / totalClasse) * 100;
                                            percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                        }

                                        return dataset.label + ": " + valor + " (" + percentual + ")";
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function progressaoDosSetores() {
    $.ajax({
        url: baseURL + "/inventario/dashboard/progressao-dos-setores",
        type: "get",
        dataType: "json",
        success: function (data) {
            if ($("#progress_sectors").get(0)) {
                var ctx = $("#progress_sectors").get(0).getContext("2d");

                var cores = ['#3CB371', '#DE3163', '#6495ED'];

                if (myBarHorizonChartProgressaoSetores !== null) {
                    myBarHorizonChartProgressaoSetores.destroy();
                }

                myBarHorizonChartProgressaoSetores = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: ["Não Iniciados", "Em Andamento", "Finalizados"],
                        datasets: [{
                            label: "Quantidade de Setores",
                            data: [
                                data.nao_iniciado[0],
                                data.em_andamento[0],
                                data.finalizado[0]
                            ],
                            backgroundColor: [
                                cores[0],
                                cores[1],
                                cores[2]
                            ],
                            borderColor: [
                                cores[0],
                                cores[1],
                                cores[2]
                            ],
                            borderWidth: 1,
                            barThickness: 35
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: { left: 10, right: 10, top: 0, bottom: 0 }
                        },
                        title: {
                            display: true,
                            fontSize: 14,
                            text: "Progressão dos Setores"
                        },
                        legend: {
                            display: false
                        },
                        plugins: {
                            datalabels: false
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    padding: 10,
                                    callback: function (value) {
                                        return value;
                                    }
                                },
                                gridLines: {
                                    color: "rgb(224, 236, 244)",
                                    zeroLineColor: "rgb(234, 236, 244)",
                                    drawBorder: true,
                                    borderDash: [2],
                                    zeroLineBorderDash: [2]
                                },
                                stacked: false
                            }],
                            yAxes: [{
                                ticks: {
                                    padding: 10,
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    display: false
                                },
                                stacked: false
                            }]
                        },
                        tooltips: {
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: true,
                            callbacks: {
                                title: function (tooltipItems, data) {
                                    return data.labels[tooltipItems[0].index];
                                },
                                label: function (tooltipItem, chart) {
                                    var dataset = chart.datasets[tooltipItem.datasetIndex];
                                    var valor = Number(dataset.data[tooltipItem.index]) || 0;

                                    var totalGeral = data.nao_iniciado[0] + data.em_andamento[0] + data.finalizado[0];

                                    let percentual;
                                    if (!totalGeral || totalGeral === 0 || isNaN(totalGeral)) {
                                        percentual = valor > 0 ? "100,00%" : "0,00%";
                                    } else {
                                        let percentualNum = (valor / totalGeral) * 100;
                                        percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                    }

                                    return "Qtd: " + valor + " (" + percentual + ")";
                                }
                            }
                        }
                    }
                });
            }
        }
    });
}

function statusDosSetores() {
    $.ajax({
        url: baseURL + "/inventario/dashboard/status-dos-setores",
        type: "get",
        dataType: "json",
        success: function (data) {
            if ($("#status_sectors").get(0)) {
                var ctx = $("#status_sectors").get(0).getContext("2d");

                var cores = generateColors(data.status, colors);

                if (myPieChartStatusDosSetores !== null) {
                    myPieChartStatusDosSetores.destroy();
                }

                myPieChartStatusDosSetores = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: data.status,
                        datasets: [{
                            backgroundColor: cores,
                            borderColor: '#fff',
                            borderWidth: 2,
                            label: "Qtde",
                            data: data.qtd
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
                        title: {
                            display: true,
                            fontSize: 14,
                            text: "Status dos Setores"
                        },
                        legend: {
                            display: true,
                            position: "left",
                            labels: {
                                padding: 15,
                                boxWidth: 12
                            }
                        },
                        plugins: {
                            datalabels: false
                        },
                        tooltips: {
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: true,
                            callbacks: {
                                title: function (tooltipItems, data) {
                                    return data.labels[tooltipItems[0].index];
                                },
                                label: function (tooltipItem, chart) {
                                    var dataset = chart.datasets[tooltipItem.datasetIndex];
                                    var valor = Number(dataset.data[tooltipItem.index]) || 0;

                                    var totalGeral = dataset.data.reduce(function (a, b) {
                                        return (Number(a) || 0) + (Number(b) || 0);
                                    }, 0);

                                    let percentual;
                                    if (!totalGeral || totalGeral === 0 || isNaN(totalGeral)) {
                                        percentual = valor > 0 ? "100,00%" : "0,00%";
                                    } else {
                                        let percentualNum = (valor / totalGeral) * 100;
                                        percentual = (isNaN(percentualNum) ? "0,00%" : percentualNum.toFixed(2).replace('.', ',')) + "%";
                                    }

                                    return dataset.label + ": " + valor + " (" + percentual + ")";
                                }
                            }
                        }
                    }
                });
            }
        }
    });
}