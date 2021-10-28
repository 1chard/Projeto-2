<?php

import("banco/conexao.php");

class Categoria
{
    public $id = null;
    public $nome = '';

    public function __construct(int $id, string $nome){
            $this->nome = $nome;
            $this->id = $id;
    }

    static public function inserir(Categoria $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "INSERT into categoria(nome) values('$param->nome');");
    }

    static public function buscar(int $id): ?Categoria{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from categoria where idcategoria=$id;")->fetch_assoc();

        return $resultado? new Categoria((int) $resultado['idcategoria'], $resultado['nome']) : null;
    }

    static public function listar(): ?array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from categoria;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Categoria((int) $iterator['idcategoria'], $iterator['nome']));
        }

        return (count($retorno) > 0)? $retorno : null;
    }

    public static function atualizar(Categoria $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("UPDATE categoria SET nome='$param->nome' where idcategoria=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        return $temp->conexao->query("DELETE from categoria where idcategoria=$id;");
    }
}
