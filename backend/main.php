<?php


function exception_error_handler($severity, $message, $file, $line): void
{
	if (!((E_WARNING | E_ERROR | E_PARSE) & $severity)) {
		return;
	}
	throw new ErrorException($message, 0, $severity, $file, $line);
}

set_error_handler("exception_error_handler");

function import(string $toImport)
{
	require_once filter_input(INPUT_SERVER,  'DOCUMENT_ROOT') . '/backend/' . $toImport;
}


$body = json_decode(file_get_contents('php://input') ?: '{}');

import('util/constantes.php');
import('banco/categoria.php');
import('banco/contato.php');
import('banco/usuario.php');
import('banco/hamburguer.php');
import('banco/imagem.php');
import('util/urlparser.php');

$requisicao = json_decode(filter_input(INPUT_POST,  'requisicao') ?? '');
$resposta = null;
$camposUrl = fields();

switch (filter_input(INPUT_SERVER,  'REQUEST_METHOD')) {
	case 'GET':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				if (isset($camposUrl[1])) {
					$resposta = Categoria::buscar((int) $camposUrl[1]);
				} else {
					$resposta = Categoria::listar();
				}
				break;
			case "contato":
				if (isset($camposUrl[1])) {
					$resposta = Contato::buscar((int) $camposUrl[1]);
				} else {
					$resposta = Contato::listar();
				}
				break;
			case "usuario":
				if (isset($camposUrl[1])) {
					$resposta = Usuario::buscar((int) $camposUrl[1]);
					unset($resposta->senha);
				} else {
					$resposta = Usuario::listar();
					foreach ($resposta as $iterator) {
						unset($iterator->senha);
					}
				}
				break;
			case "hamburguer":
				if (isset($camposUrl[1])) {
					$resposta = Hamburguer::buscar((int) $camposUrl[1]);
					$resposta->imagem = Imagem::buscar($resposta->id);
				} else {
					$resposta = Hamburguer::listar();
					foreach ($resposta as $iterator) {
						$iterator->imagem = Imagem::buscar($iterator->idimagem);
					}
				}
				break;
		}
		break;
	case 'POST':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				$resposta = Categoria::inserir(new Categoria(0, $body->nome));
				break;
			case "contato":
				$resposta = Contato::inserir(new Contato(0, $body->nome, $body->email, $body->celular));
				break;
			case "usuario":
				$resposta = Usuario::inserir(new Usuario(0, $body->nome, $body->email, $body->senha));
				break;
			case "login":
				$resposta = Usuario::logar(new Usuario(0, '', $body->email, $body->senha));
				break;
			case "hamburguer":
				$filename = sha1($body->nome . rand() . time() . microtime()) . substr($body->nomearquivo, strrchr($body->nomearquivo, '.') + 1);

				file_put_contents(".img/" . $filename, base64_decode($body->base64));
				
				$resposta = (bool) Imagem::inserir(new Imagem(0, $filename));
				if ($resposta) {
					$imagemId = Imagem::buscarPorNome($filename)->id;

					$resposta = $resposta && Hamburguer::inserir(new Hamburguer(
						0,
						$body->nome,
						(float) $body->valor,
						(int) $body->categoria,
						(int) $imagemId,
						(float) $body->desconto ?? 0.0,
						(bool) $body->destaque ?? false
					));
				}
				break;
		}
		break;
	case 'PUT':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				$resposta = Categoria::atualizar(new Categoria($camposUrl[1], $body->nome));
				break;
			case "contato":
				$resposta = Contato::atualizar(new Contato((int) $camposUrl[1], $body->nome, $body->email, $body->celular));
				break;
			case "usuario":
				$resposta = Usuario::atualizar(new Usuario((int) $body->id, $body->nome, $body->email, $body->senha));
				break;
		}
		break;
	case 'DELETE':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				$resposta = Categoria::deletar((int) $camposUrl[1]);
				break;
			case "contato":
				$resposta = Contato::deletar((int) $camposUrl[1]);
				break;
			case "usuario":
				$resposta = Usuario::deletar((int) $camposUrl[1]);
				break;
		}

		echo $resposta;

		if (!$resposta)
			$resposta = null;
		break;
}


if ($resposta !== null) {
	if ($resposta === "" || $resposta === array() || $resposta === false)
		http_response_code(204);
	else
		http_response_code(200);

	echo $resposta ? json_encode($resposta) : '';
} else {
	http_response_code(404);
	echo "404 not found";
}
