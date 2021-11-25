<?php

import("banco/conexao.php");

class Hamburguer {

    public $id = null;
    public $nome = '';
    public $valor = null;
    public $desconto = 0.0;
    public $destaque = false;
    public $idimagem = null;
    public $idcategoria = null;

    public function __construct(int $id,string $nome,float $valor, int $idcategoria, int $idimagem, float $desconto = 0.0,bool $destaque = false) {
        $this->id = $id;
        $this->nome = $nome;
        $this->valor = $valor;
        $this->desconto = $desconto;
        $this->destaque = $destaque;
        $this->idimagem = $idimagem;
        $this->idcategoria = $idcategoria;
    }
    
    public static function buscar(int $id): ?Hamburguer {
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from produto where idproduto=$id;")->fetch_assoc();

        return $resultado? new Hamburguer(
                (int)       $resultado['idproduto'],
                (string)    $resultado['nome'],
                (float)     $resultado['valor'],
                (int)       $resultado['idcategoria'],
                (int)       $resultado['idimagem'],
                (float)     $resultado['desconto'],
                (bool)      $resultado['destaque']
                ) : null;
    }
    
    static public function listar(): array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from produto;");

        $retorno = array();

		
		if($resultado !== false){
			while ($iterator = $resultado->fetch_assoc()) {
				array_push($retorno, new Hamburguer(
					(int)       $iterator['idproduto'],
					(string)    $iterator['nome'],
					(float)     $iterator['valor'],
					(int)       $iterator['idcategoria'],
					(int)       $iterator['idimagem'],
					(float)     $iterator['desconto'],
					(bool)      $iterator['destaque']
					));
			}	
		}
        
        return $retorno;
    }


    static public function inserir(Hamburguer $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("
                INSERT into imagem(nome, valor, desconto, destaque, idimagem, idcategoria) values(
                '$param->nome',
                '$param->valor',
                '$param->desconto',
                '$param->destaque',
                $param->idimagem,
                $param->idcategoria,
                );
            ");
    }
}
