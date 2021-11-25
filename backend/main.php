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
		}
		break;
	case 'PUT':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				$resposta = Categoria::atualizar(new Categoria($camposUrl[1], $body->nome));
				break;
		}
		break;
	case 'DELETE':
		switch ($camposUrl[0] ?? null) {
			case "categoria":
				$resposta = Categoria::deletar((int) $camposUrl[1]);
				break;
		}

		echo $resposta;

		if(!$resposta)
			$resposta = null;
		break;

}


if ($resposta !== null) {
	if($resposta === "" || $resposta === array() || $resposta === false)
		http_response_code(204);
	else
		http_response_code(200);

	echo $resposta ? json_encode($resposta) : '';
} else {
	http_response_code(404);
	echo "404 not found";
}
