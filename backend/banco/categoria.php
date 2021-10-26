<?php

import("banco/conexao.php");

class Categoria
{
    public $id = null;
    public $nome = '';

    public function __construct(...$args){
        switch(gettype($args[0]) ?? ''){
            case 'array':
                $this->id = $args[0]['idcategoria'];
                $this->nome = $args[0]['nome'];
                break;
            case 'string':
                $this->nome = $args[0];
                break;
            default:
                throw new ArgumentCountError("Construtor desconhecido.");
        }
    }

    static public function inserir(Categoria $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "INSERT into categoria(nome) values('$param->nome');")? true : false;
    }

    static public function buscar(int $id): Categoria{
        $temp = new Banco();
        $resultado = mysqli_query($temp->conexao, "SELECT * from categoria where "
            . "idcategoria=$id;");

        return $resultado? new Categoria($resultado->fetch_assoc()) : null;
    }

    static public function listar(): array{
        $temp = new Banco();
        $resultado = mysqli_query($temp->conexao, "SELECT * from categoria;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc())
            array_push($retorno, new Categoria($iterator));

        return $retorno;
    }
}
