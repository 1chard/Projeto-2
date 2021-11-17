<?php


function exception_error_handler($severity, $message, $file, $line): void {
    if (!((E_WARNING | E_ERROR | E_PARSE) & $severity)) {
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
}

set_error_handler("exception_error_handler");

function import(string $toImport): void {
    require_once $_SERVER['DOCUMENT_ROOT'] . '/backend/' . $toImport;
}

echo "{\"ds\": 323}";
die;
        
import('util/constantes.php');
import('banco/categoria.php');
import('banco/contato.php');
import('banco/usuario.php');
import('banco/hamburguer.php');
import('banco/imagem.php');

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
                        foreach (($resposta ?? array()) as $iterator) {
                            unset($iterator->senha);
                        }
                        $status = $resposta !== null;
                        break;
                    default:
                        break;
                }
                break;
            case "hamburguer":
            case 'buscar':
                $resposta = Hamburguer::buscar((int) $_GET['id']);
                
                if($resposta)
                    $resposta->imagem = Imagem::buscar($resposta->idimagem ?? 0);
                
                $status = $resposta !== null;
                break;
            case 'listar':
                $resposta = Hamburguer::listar();
                
                foreach ($resposta as $iterator) {
                    $iterator->imagem = Imagem::buscar($iterator->idimagem);
                }
                
                $status = $resposta !== null;
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
            case "hamburguer":
                switch ($_POST['pedido']) {
                    case "inserir":
                        $filename = sha1($requisicao->nome . rand() . time() . microtime()) . substr($requisicao->nomearquivo, strrchr($requisicao->nomearquivo, '.') + 1);

                        file_put_contents(".img/" . $filename, base64_decode($requisicao->base64));
                        $status = (bool) Imagem::inserir(new Imagem(0, $filename));
                        if ($status) {
                            $imagemId = Imagem::buscarPorNome($filename)->id;

                            $status = $status && Hamburguer::inserir(new Hamburguer(
                                                    0,
                                                    $requisicao->nome,
                                                    (float) $requisicao->valor,
                                                    (int) $requisicao->categoria,
                                                    (int) $imagemId,
                                                    (float) $requisicao->desconto ?? 0.0,
                                                    (bool) $requisicao->destaque ?? false
                            ));
                        }
                        break;
                    case "atualizar":
                        $status = Hamburguer::atualizar(new Hamburguer((int) $requisicao->id, $requisicao->nome, $requisicao->email, $requisicao->senha));
                        break;
                    case 'deletar':
                        $status = Hamburguer::deletar((int) $requisicao->id);
                        break;
                }
                break;
        }
        break;
    case 'PUT':
        break;
    default:
        http_response_code(405);
        return;
}

if ($status !== null) {
    http_response_code(200);
    
    $retorno = new stdClass();
    $retorno->ok = $status;

    if ($resposta !== null) {
        $retorno->resposta = $resposta;
    }
}
else{
    http_response_code(204);
}

echo $retorno ? json_encode($retorno) : '';
