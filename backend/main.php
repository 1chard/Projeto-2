<?php


function exception_error_handler($severity, $message, $file, $line): void {
    if (!((E_WARNING | E_ERROR | E_PARSE) & $severity)) {
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
}

set_error_handler("exception_error_handler");

function import(string $toImport) {
    require_once filter_input(INPUT_SERVER,  'DOCUMENT_ROOT') . '/backend/' . $toImport;
}

error_log($_SERVER['SERVER_ADDR']);

$body = json_decode(file_get_contents('php://input') ?: '{}');

import('util/constantes.php');
import('banco/categoria.php');
import('banco/contato.php');
import('banco/usuario.php');
import('banco/hamburguer.php');
import('banco/imagem.php');

$requisicao = json_decode(filter_input(INPUT_POST,  'requisicao') ?? '');
$status = null;
$retorno = null;

switch (filter_input(INPUT_SERVER,  'REQUEST_METHOD')) {
    case 'GET':
        switch (filter_input(INPUT_GET,  'tipo')) {
            case "categoria":
                switch (filter_input(INPUT_GET,  'pedido')) {
                    case 'buscar':
                        $resposta = Categoria::buscar((int) filter_input(INPUT_GET,  'id'));
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
                switch (filter_input(INPUT_GET,  'pedido') ?? '') {
                    case 'buscar':
                        $resposta = Contato::buscar((int) filter_input(INPUT_GET,  'id'));
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
                switch (filter_input(INPUT_GET,  'pedido')) {

                    case 'buscar':
                        $resposta = Usuario::buscar((int) filter_input(INPUT_GET,  'id'));
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
                $resposta = Hamburguer::buscar((int) filter_input(INPUT_GET,  'id'));
                $resposta->imagem = Imagem::buscar($resposta->id);
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
        switch (filter_input(INPUT_POST,  'tipo')) {
            case "categoria":
                switch (filter_input(INPUT_POST,  'pedido')) {
                    case "inserir":
                        $status = Categoria::inserir(new Categoria(0, $body->info->nome));
                        break;
                    case "atualizar":
                        $status = Categoria::atualizar(new Categoria((int) $body->info->id, $body->info->nome));
                        break;
                    case 'deletar':
                        $status = Categoria::deletar((int) $body->info->id);
                        break;
                }
                break;
            case "contato":
                switch (filter_input(INPUT_POST,  'pedido')) {
                    case "inserir":
                        $status = Contato::inserir(new Contato(0, $body->info->nome, $body->info->email, $body->info->celular));
                        break;
                    case "atualizar":
                        $status = Contato::atualizar(new Contato((int) $body->info->id, $body->info->nome, $body->info->email, $body->info->celular));
                        break;
                    case 'deletar':
                        $status = Contato::deletar((int) $body->info->id);
                        break;
                }
                break;
            case "usuario":
                switch (filter_input(INPUT_POST,  'pedido')) {
                    case "inserir":
                        $status = Usuario::inserir(new Usuario(0, $body->info->nome, $body->info->email, $body->info->senha));
                        break;
                    case "atualizar":
                        $status = Usuario::atualizar(new Usuario((int) $body->info->id, $body->info->nome, $body->info->email, $body->info->senha));
                        break;
                    case 'deletar':
                        $status = Usuario::deletar((int) $body->info->id);
                        break;
                    case 'logar':
                        $status = Usuario::logar(new Usuario(0, '', $body->info->email, $body->info->senha));
                        break;
                    default;
                }
                break;
            case "hamburguer":
                switch (filter_input(INPUT_POST,  'pedido')) {
                    case "inserir":
                        $filename = sha1($body->info->nome . rand() . time() . microtime()) . substr($body->info->nomearquivo, strrchr($body->info->nomearquivo, '.') + 1);

                        file_put_contents(".img/" . $filename, base64_decode($body->info->base64));
                        $status = (bool) Imagem::inserir(new Imagem(0, $filename));
                        if ($status) {
                            $imagemId = Imagem::buscarPorNome($filename)->id;

                            $status = $status && Hamburguer::inserir(new Hamburguer(
                                                    0,
                                                    $body->info->nome,
                                                    (float) $body->info->valor,
                                                    (int) $body->info->categoria,
                                                    (int) $imagemId,
                                                    (float) $body->info->desconto ?? 0.0,
                                                    (bool) $body->info->destaque ?? false
                            ));
                        }
                        break;
                    case "atualizar":
                        $status = Hamburguer::atualizar(new Hamburguer((int) $body->info->id, $body->info->nome, $body->info->email, $body->info->senha));
                        break;
                    case 'deletar':
                        $status = Hamburguer::deletar((int) $body->info->id);
                        break;
                    default;
                }
                break;
            default;
        }
        break;
    default;
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
