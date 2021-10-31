<?php
function exception_error_handler($severity, $message, $file, $line) {
    if (!((E_WARNING | E_ERROR | E_PARSE) & $severity))
        return;
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler("exception_error_handler");

function import(string $toImport){
    require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport;
}

import('util/constantes.php');
import('banco/categoria.php');
import('banco/contato.php');

$status = (bool) false;
$resposta = null;
$requisicao = (($_REQUEST['requisicao']) ? json_decode($_REQUEST['requisicao']) : new stdClass());

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch ($_GET['tipo']) {
            case "categoria":
                switch ($_GET['pedido']) {
                    case 'buscar':
                        $resposta = Categoria::buscar((int) $requisicao->id);
                        $status = $resposta !== null;
                        break;
                    case 'listar':
                        $resposta = Categoria::listar();
                        $status = $resposta !== null;
                        break;
                    default:
                        break;
                }
                break;
            case "contato":
                switch ($_GET['pedido']) {
                    case 'buscar':
                        $resposta = Contato::buscar((int) $requisicao->id);
                        $status = $resposta !== null;
                        break;
                    case 'listar':
                        $resposta = Contato::listar();
                        $status = $resposta !== null;
                        break;
                    default:
                        break;
                }
                break;
        }
        break;
    case 'POST':
        switch ($_POST['tipo']) {
            case "categoria":
                switch ($_POST['pedido']) {
                    case "inserir":
                        $status = Categoria::inserir(new Categoria(0, $requisicao->nome));
                        break;
                    case "atualizar":
                        $status = Categoria::atualizar(new Categoria((int) $requisicao->id, $requisicao->nome));
                        break;
                    case 'deletar':
                        $status = Categoria::deletar((int) $requisicao->id);
                        break;
                }
                break;
            case "contato":
                switch ($_POST['pedido']) {
                    case "inserir":
                        $status = Contato::inserir(new Contato(0, $requisicao->nome, $requisicao->email, $requisicao->celular));
                        break;
                    case "atualizar":
                        $status = Contato::atualizar(new Contato((int) $requisicao->id, $requisicao->nome, $requisicao->email, $requisicao->celular));
                        break;
                    case 'deletar':
                        $status = Contato::deletar((int) $requisicao->id);
                        break;
                }
                break;
                
        }
        break;
    case 'PUT':
        var_dump($requisicao);
        break;
    case 'DELETE':
        break;
    default:
        break;
}

$retorno = new stdClass();
$retorno->ok = $status;
if ($resposta !== null)
    $retorno->resposta = $resposta;

echo json_encode($retorno);
