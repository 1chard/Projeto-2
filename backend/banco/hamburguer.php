<?php

import("banco/conexao.php");

class Hamburguer
{
    public $id = null;
    public $nome = '';
    public $categoria = '';
    public $preco = 0.0;
    public $desconto = null;
    public $descricao = null;

    public function __construct(...$args)
    {
        if(gettype($args[0]) === 'array' && count($args) === 1){
            $this->id = $args[0]['idhamburguer'];
        $this->nome = $args[0]['nome'];
        $this->categoria = $args[0]['categoria'];
        $this->preco = $args[0]['preco'];
        $this->desconto = $args[0]['desconto'];
        $this->descricao = $args[0]['descricao'];
        }
        else if(count($args) >= 3 && count($args) < 6){
            $this->nome = $args[0];
            $this->categoria = $args[1];
            $this->preco = $args[2];
            $this->desconto = $args[3] ?? null;
            $this->descricao = $args[4] ?? null;
        }
        else 
            throw new ArgumentCountError("Construtor desconhecido.");
    }

    static public function inserir(Hamburguer $param): bool
    {
        $temp = new Banco();



        return mysqli_query($temp->conexao, "INSERT into hamburguer(nome, categoria, preco, desconto ,descricao)"
            . " values($param->nome, $param->categoria, $param->preco, $param->desconto, $param->descricao);")
            ? true : false;
    }



    static public function buscar(int $id): Hamburguer{
        $temp = new Banco();
        $resultado = mysqli_query($temp->conexao, "SELECT * from hamburguer where "
            . "idhamburguer=$id;");

        return $resultado? new Hamburguer($resultado->fetch_assoc()) : null;
    }

    static public function listar()
    {
        $temp = new Banco();
        $resultado = mysqli_query($temp->conexao, "SELECT * from hamburguer order by idhamburguer desc;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc())
            array_push($retorno, new Hamburguer($iterator));

        return $retorno;
    }
}
