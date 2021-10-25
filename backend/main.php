<?php
function import(string $toImport)
{
    require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport);
}

import('util/constantes.php');
import('banco/categoria.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if($_GET['id'])
            echo json_encode(Categoria::buscar($_GET['id']));
        else
            echo json_encode(Categoria::listar());

        break;
    case 'POST':

        break;
    case 'PUT':

        break;
    case 'DELETE':

        break;
    default:
        echo '{ "ok", false}';    
}

