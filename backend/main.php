<?php
function import(string $toImport)
{
    require_once($_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport);
}

import('util/constantes.php');
import('banco/categoria.php');


$status = (bool) false;
$resposta = null;
$requisicao = (($_REQUEST['requisicao'] ?? false)? json_decode($_REQUEST['requisicao']) : null);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch($_GET['tipo']){
            case "categoria":
                switch($_GET['pedido']){
                    case 'buscar':
                        $resposta = Categoria::buscar( (int)$requisicao->id);
                        $status = $resposta !== null;
                        break;
                        case 'listar':
                            $resposta = Categoria::listar();
                            $status = $resposta !== null;
                            break;
                }
            
            break;
        }
        break;
    case 'POST':
        switch($_POST['tipo']){
            case "categoria":{
                switch($_POST['pedido']){
                    case "inserir":
                        $status = Categoria::inserir(new Categoria($requisicao->nome));
                        break;
                    case "atualizar":
                        $status = Categoria::atualizar(new Categoria($requisicao->nome, $requisicao->id));
                        break;
                    case 'deletar':
                        $status = Categoria::deletar($requisicao->id);
                        break;
                }
            }
        }
        break;
    case 'PUT':
        echo file_get_contents('php://input');
        break;
    case 'DELETE':

        break;
    default:
        $status = false;
}

$retorno = new stdClass();
$retorno->ok = $status;
if($resposta !== null)
    $retorno->resposta = $resposta;

echo json_encode($retorno);

