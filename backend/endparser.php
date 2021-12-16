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

                if ($resposta !== null) {
                    $resposta->categoria = Categoria::buscar($resposta->idcategoria)->nome;
                    $resposta->imagem = Imagem::buscar($resposta->idimagem)->nome;
                    unset($resposta->idcategoria);
                    unset($resposta->idimagem);
                }
            } else {
                $resposta = Hamburguer::listar();
                foreach ($resposta as $iterator) {
                    $iterator->imagem = Imagem::buscar($iterator->idimagem)->nome;
                    $iterator->categoria = Categoria::buscar($iterator->idcategoria)->nome;
                    unset($iterator->idcategoria);
                    unset($iterator->idimagem);
                }
            }
            break;
    }

    return $resposta;
}
