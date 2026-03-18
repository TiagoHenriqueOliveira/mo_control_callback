@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="container">

    <div class="row justify-content-center">

        <div class="col-xl-5 col-lg-6 col-md-8">

            <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">

                    <div class="p-5">
                        <div class="text-center">
                            <h1 class="h4 text-gray-900 mb-4">Sys.BuildFlow</h1>
                        </div>

                        <form method="POST" action="{{ route('login.process') }}">
                            @csrf

                            <div class="form-group">
                                <input type="email"
                                       name="email"
                                       class="form-control form-control-user"
                                       placeholder="Email"
                                       required>
                            </div>

                            <div class="form-group">
                                <input type="password"
                                       name="password"
                                       class="form-control form-control-user"
                                       placeholder="Senha"
                                       required>
                            </div>

                            <button type="submit"
                                    class="btn btn-primary btn-user btn-block">
                                Entrar
                            </button>
                        </form>

                        <hr>

                        <div class="text-center">
                            <small class="text-muted">
                                © {{ date('Y') }} BuildFlow
                            </small>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>

</div>
@endsection