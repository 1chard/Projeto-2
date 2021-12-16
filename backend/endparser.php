<?php

function getParserDeslogado()
{
    $resposta = null;

    switch (Request::$parameters[0]) {
        case "categoria":
            $resposta = isset(Request::$parameters[1]) ? Categoria::buscar((int) Request::$parameters[1]) : Categoria::listar();
            break;
        case "hamburguer":
            if (isset($camposUrl[1])) {
                $resposta = Hamburguer::buscar((int) $camposUrl[1]);

            } else {
                $resposta = Hamburguer::listar();
            }
            break;
    }

    return $resposta;
}
