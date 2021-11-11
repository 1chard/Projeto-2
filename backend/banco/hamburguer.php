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

    static public function inserir(Hamburguer $param): bool{
        $temp = new Banco();
        return $temp->conexao->query(<<<EOF
                INSERT into imagem(nome, valor, desconto, destaque, idimagem, idcategoria) values(
                    '$param->nome',
                    '$param->valor',
                '$param->desconto',
                '$param->destaque',
                $param->idimagem,
                $param->idcategoria,
                );
                EOF);
    }
}
