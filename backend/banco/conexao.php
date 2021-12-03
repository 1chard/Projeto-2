<?php
import('util/constantes.php');

class Banco
{
	public mysqli $conexao;
	private mysqli_stmt $stmt;
	public string $tabela = '';
	private int $modo;

	const MODO_INSERIR = 1;

	function __construct()
	{
		$this->conexao = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
	}

	function __destruct()
	{
		mysqli_close($this->conexao);
	}

	public static function newInstance(): Banco
	{
		$s = new Banco();

		return $s;
	}

	public function inserir(string $onde, array $campos, array $valores): bool
	{

		$valquery = "(";
		$valvalues = "VALUES(";

		foreach ($campos as $campo) {
			$valquery .= "$campo,";
			$valvalues .= "?,";
		}

		$valquery[strlen($valquery) - 1] = ')';
		$valvalues[strlen($valvalues) - 1] = ')';

		$this->stmt = $this->conexao->prepare("INSERT into ${onde}$valquery $valvalues");

		if ($this->stmt === null)
			throw new Exception("Nenhum campo foi inserido");

		$chars = "";

		foreach ($valores as $valorIterator) {
			$chars .= self::char($valorIterator);
		}

		if (!$this->stmt->bind_param($chars, ...$valores))
			throw new Exception("Algo deu errado");

		$result = $this->stmt->execute();

		return $result;
	}



	private static function char(mixed $test)
	{
		if (is_int($test))
			return 'i';
		else if (is_float($test))
			return 'd';
		else
			return 's';
	}
}
