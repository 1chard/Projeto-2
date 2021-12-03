<?php

import("banco/conexao.php");

class Categoria
{
    public int $id;
    public string $nome;

    public function __construct(int $id, string $nome){
            $this->nome = $nome;
            $this->id = $id;
    }

    static public function inserir(Categoria $param): bool{
		return Banco::newInstance()->inserir("categoria", ['nome'], [$param->nome]);
        //return $temp->conexao->query("INSERT into categoria(nome) values('$param->nome');");

    }

    static public function buscar(int $id): ?Categoria{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from categoria where idcategoria=$id;")->fetch_assoc();

        return $resultado? new Categoria((int) $resultado['idcategoria'], $resultado['nome']) : null;
    }

    static public function listar(): array{
        $temp = new Banco();

        $resultado = $temp->conexao->query("SELECT * from categoria;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Categoria((int) $iterator['idcategoria'], $iterator['nome']));
        }

        return $retorno;
    }

    public static function atualizar(Categoria $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("UPDATE categoria SET nome='$param->nome' where idcategoria=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        $temp->conexao->real_query("DELETE from categoria where idcategoria=$id;");

        return $temp->conexao->affected_rows > 0;
    }
}
