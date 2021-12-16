<?php

import("banco/Banco.php");

class Categoria
{
    public int $id;
    public string $nome;

    public function __construct(int $id, string $nome){
            $this->nome = $nome;
            $this->id = $id;
    }

    static public function inserir(Categoria $param): bool{
		return Banco::inserir("INSERT into categoria(nome) values('?');", $param->nome);
    }

    static public function buscar(int $id): ?Categoria{
        $resultado = Banco::buscar("SELECT * from categoria where idcategoria=?;", $id);

        return $resultado? new Categoria((int) $resultado['idcategoria'], $resultado['nome']) : null;
    }

    static public function listar(): array{
        $retorno = array();

        foreach (Banco::listar("SELECT * from categoria;") as $iterator) {
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
