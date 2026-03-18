<?php

namespace App\Http\Controllers;

class AuthController extends Controller
{
    /**
     * Exibe a tela de login
     */
    public function mostrarLogin()
    {
        return view('login.index');
    }

}
