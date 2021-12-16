<?php

import('util/constantes.php');
import('util/dummyconstructor.php');

class Banco {

    public static mysqli $conexao;

	private static function parser(string $sql, array $parametros): string {
		foreach($parametros as &$value){
			$pos = strpos($sql, '?');
			if ($pos !== false) {
				$sql = substr_replace($sql, Banco::$conexao->real_escape_string((string) $value), $pos, strlen('?'));
			}
		}	

		unset($value);
		return $sql;
	}

    public static function inserir(string $sql, ...$parametros): bool {
		return Banco::$conexao->query(self::parser($sql, $parametros));
    }

	public static function atualizar(string $sql, ...$parametros): int {
		Banco::$conexao->query(self::parser($sql, $parametros));

		return Banco::$conexao->affected_rows;
    }
    
    public static function listar(string $sql, ...$parametros): array {
		$retorno = array();
		
		$queryResult = Banco::$conexao->query(self::parser($sql, $parametros));

		while($iterator = $queryResult->fetch_assoc()){
			array_push($retorno, $iterator);
		}

		return $retorno;
    }

	public static function buscar(string $sql, ...$parametros): ?array {
		return Banco::$conexao->query(self::parser($sql, $parametros))->fetch_assoc();
    }

	public static function deletar(string $sql, ...$parametros): int {
		Banco::$conexao->real_query(self::parser($sql, $parametros));

        return Banco::$conexao->affected_rows;
    }

}

Banco::$conexao = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);