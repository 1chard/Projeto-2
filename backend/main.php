<?php
function exception_error_handler($severity, $message, $file, $line): void{
    if (!((E_WARNING | E_ERROR | E_PARSE) & $severity))
        return;
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler("exception_error_handler");

function import(string $toImport): void{
    require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport;
}

import('util/constantes.php');
import('banco/categoria.php');
import('banco/contato.php');
import('banco/usuario.php');

$requisicao = json_decode($_REQUEST['requisicao']) ?? new stdClass();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch ($_GET['tipo']) {
            case "categoria":
                switch ($_GET['pedido']) {
                    case 'buscar':
                        $resposta = Categoria::buscar((int) $_GET['id']);
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
                        $resposta = Contato::buscar((int) $_GET['id']);
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
            case "usuario":
                switch ($_GET['pedido']) {

                    case 'buscar':
                        $resposta = Usuario::buscar((int) $_GET['id']);
                        unset($resposta->senha);
                        $status = $resposta !== null;
                        break;
                    case 'listar':
                        $resposta = Usuario::listar();
                        foreach( ($resposta ?? array()) as $e) {
                            unset($e->senha);
                        }
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
            case "usuario":
                switch ($_POST['pedido']) {
                    case "inserir":
                        $status = Usuario::inserir(new Usuario(0, $requisicao->nome, $requisicao->email, $requisicao->senha));
                        break;
                    case "atualizar":
                        $status = Usuario::atualizar(new Usuario((int) $requisicao->id, $requisicao->nome, $requisicao->email, $requisicao->senha));
                        break;
                    case 'deletar':
                        $status = Usuario::deletar((int) $requisicao->id);
                        break;
                    case 'logar':
                        $status = Usuario::logar(new Usuario(0, '', $requisicao->email, $requisicao->senha));
                        break;
                }
                break;
        }
        break;
    case 'PUT':
        
        file_put_contents("C:\\Users\\21193534\\FJKSJFKFJK.png", base64_decode(file_get_contents('php://input')));
        break;
    default:
        break;
}

if($status !== null){
$retorno = new stdClass();
$retorno->ok = $status;

if ($resposta !== null)
    $retorno->resposta = $resposta;
}

echo $retorno? json_encode($retorno) : '';
