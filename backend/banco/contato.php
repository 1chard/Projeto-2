<?php

import("banco/conexao.php");

class Contato
{
    public $id = null;
    public $nome = '';
    public $email = '';
    public $celular = 0;

    public function __construct(int $id, string $nome, string $email, int $celular){
            $this->nome = $nome;
            $this->id = $id;
            $this->email = $email;
            $this->celular = $celular;
    }

    static public function inserir(Contato $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "INSERT into contato(nome, email, celular) values('$param->nome', '$param->email', $param->celular);");
    }

    static public function buscar(int $id): ?Contato{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from contato where idcontato=$id;")->fetch_assoc();

        return $resultado? new Contato((int) $resultado['idcontato'], $resultado['nome'], $resultado['email'], (int)$resultado['celular']) : null;
    }

    static public function listar(): ?array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from contato;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Contato((int) $iterator['idcontato'], $iterator['nome'], $iterator['email'], (int) $iterator['celular']));
        }

        return (count($retorno) > 0)? $retorno : null;
    }

    public static function atualizar(Contato $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("UPDATE contato SET nome='$param->nome', email='$param->email', celular=$param->celular where idcontato=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        return $temp->conexao->query("DELETE from contato where idcontato=$id;");
    }
}
