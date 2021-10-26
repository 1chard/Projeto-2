<?php
function import(string $toImport)
{
    require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport);
}

import('util/constantes.php');
import('banco/categoria.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if($_GET['id'] ?? false)
            echo json_encode(Categoria::buscar($_GET['id']));
        else
            echo json_encode(Categoria::listar());
        break;
    case 'POST':
        echo Categoria::inserir(new Categoria($_POST['nome']))? '{ "ok", true}' : '{ "ok", false}';
        break;
    case 'PUT':
        var_dump(file_get_contents('php://input')); 
        break;
    case 'DELETE':

        break;
    default:
        echo '{ "ok", false}';    
}

