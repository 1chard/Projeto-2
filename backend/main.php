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
$status = (int) 0;

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

					if($resposta !== null){
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
				$filename = sha1($body->nome . rand() . time() . microtime()) . '.' . substr($body->imagem->mimetype, strrpos($body->imagem->mimetype, '/') + 1);
				file_put_contents("../img/" . $filename, base64_decode($body->imagem->base64));

				$imagemCadrastro = (bool) Imagem::inserir(new Imagem(0, $filename));

				if ($imagemCadrastro) {
					$imagemId = Imagem::buscarPorNome($filename)->id;

					error_log($imagemId);
					$resposta = $imagemCadrastro && Hamburguer::inserir(new Hamburguer(
						0,
						$body->nome,
						(float) $body->valor,
						(int) $body->categoria,
						(int) $imagemId,
						(float) $body->desconto ?? 0.0,
						(bool) $body->destaque ?? false
					));
				}
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
			case "hamburguer":
				//cadastra a img se mandar dnv
				if($body->imagem !== null){
					$filename = sha1($body->nome . rand() . time() . microtime()) . '.' . substr($body->imagem->mimetype, strrpos($body->imagem->mimetype, '/') + 1);
					file_put_contents("../img/" . $filename, base64_decode($body->imagem->base64));
				}
				
				$imagemCadrastro = (bool) Imagem::inserir(new Imagem(0, $filename));

				if ($imagemCadrastro) {
					$imagemId = Imagem::buscarPorNome($filename)->id;

					error_log($imagemId);
					$resposta = $imagemCadrastro && Hamburguer::inserir(new Hamburguer(
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
			case "hamburguer":
				$resposta = Hamburguer::deletar((int) $camposUrl[1]);
				break;
		}

		echo $resposta;

		if (!$resposta)
			$resposta = null;
		break;
}


if ($resposta !== null) {
	if($status !== 0){
		http_response_code($status);
	}
	else if ($resposta === "" || $resposta === array() || $resposta === false )
		http_response_code(204);
	else
		http_response_code(200);

	echo $resposta ? json_encode($resposta) : '';
} else {
	http_response_code($status !== 0? $status : 404);
}
