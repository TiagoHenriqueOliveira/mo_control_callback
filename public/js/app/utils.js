// utils.js

// Configuração global do DataTables
if ($.fn.dataTable) {
    $.extend(true, $.fn.dataTable.defaults, {
        language: {
            url: "/js/datatables/pt-BR.json"
        },
        responsive: true,
        pageLength: 25,
        processing: true
    });
}