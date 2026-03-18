<!doctype html>
<html lang="pt-br">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title', 'Sys.Buildflow')</title>

        <!-- CSS -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
        <link href="{{ asset('css/fontawesome-free/all.css') }}" rel="stylesheet">
        <link href="{{ asset('css/sb-admin-2.css') }}" rel="stylesheet">
        <link href="{{ asset('css/bootstrap/jquery-ui.min.css') }}" rel="stylesheet">
        <link href="{{ asset('css/bootstrap/jquery-ui.theme.css') }}" rel="stylesheet">
        <link href="{{ asset('css/datatables/dataTables.bootstrap4.min.css') }}" rel="stylesheet">
        <link href="{{ asset('css/datatables/responsive.dataTables.min.css') }}" rel="stylesheet">
    </head>

    <body class="bg-gradient-primary">

        @yield('content')

        <!-- JavaScript -->
        <script src="{{ asset('js/jquery/jquery.js') }}"></script>
        <script src="{{ asset('js/jquery/jquery-ui.min.js') }}"></script>
        <script src="{{ asset('js/bootstrap/bootstrap.bundle.min.js') }}"></script>
        <script src="{{ asset('js/jquery-easing/jquery.easing.min.js') }}"></script>
        <script src="{{ asset('js/sb-admin-2.min.js') }}"></script>
        <script src="{{ asset('js/app/utils.js') }}"></script>

        <!-- DataTables -->
        <script src="{{ asset('js/datatables/jquery.dataTables.min.js') }}"></script>
        <script src="{{ asset('js/datatables/dataTables.bootstrap4.min.js') }}"></script>
        <script src="{{ asset('js/datatables/dataTables.responsive.min.js') }}"></script>
        <script src="{{ asset('js/datatables/dataTables.buttons.min.js') }}"></script>
        <script src="{{ asset('js/datatables/buttons.html5.min.js') }}"></script>
        <script src="{{ asset('js/datatables/jszip.min.js') }}"></script>

        <!-- JQuery Mask -->
        <script src="{{ asset('js/jquery-mask/jquery.mask.js') }}"></script>
        <script src="{{ asset('js/jquery-mask/mask.js') }}"></script>

        <!-- Bootstrap Notify -->
        <script src="{{ asset('js/bootstrap-notify/bootstrap-notify.min.js') }}"></script>

        <!-- Charts JS -->
        <script src="{{ asset('js/chart.js/Chart.min.js') }}"></script>
        <script src="{{ asset('js/chart.js/chartjs-plugin-datalabels.min.js') }}"></script>

        <script>
            var baseURL = window.location.origin + window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
        </script>

        <!-- Scritps do App -->
        @stack('scripts')
    </body>
</html>