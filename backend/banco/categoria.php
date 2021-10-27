<?php

import("banco/conexao.php");

class Categoria
{
    public $id = null;
    public $nome = '';

    public function __construct($arg0, int $id = null){
        
        if(gettype($arg0) == 'array'){
            $this->nome = $arg0['nome'];
            $this->id = $arg0['idcategoria'];
        }
        else if(gettype($arg0) == 'string'){
            $this->nome = $arg0;
            $this->id = $id;
        }
        else
            throw new TypeError("Parametro deve ser String");
    }

    static public function inserir(Categoria $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "INSERT into categoria(nome) values('$param->nome');");
    }

    static public function buscar(int $id): ?Categoria{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from categoria where "
            . "idcategoria=$id;")->fetch_assoc();

        return $resultado? new Categoria($resultado) : null;
    }

    static public function listar(): ?array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from categoria;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc())
            array_push($retorno, new Categoria($iterator));

        return (count($retorno) > 0)? $retorno : null;
    }

    public static function atualizar(Categoria $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "UPDATE categoria SET nome='$param->nome' where idcategoria=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "DELETE from categoria where idcategoria=$id;");
    }
}
