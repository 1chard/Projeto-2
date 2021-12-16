<?php

import("banco/Banco.php");

class Contato
{
    public int $id;
    public string $nome;
    public string $email;
    public string $celular;

    public function __construct(int $id, string $nome, string $email, string $celular){
            $this->nome = $nome;
            $this->id = $id;
            $this->email = $email;
            $this->celular = $celular;
    }

    static public function buscar(int $id): ?Contato{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from contato where idcontato=$id;")->fetch_assoc();

        return $resultado? new Contato((int) $resultado['idcontato'], $resultado['nome'], $resultado['email'], $resultado['celular']) : null;
    }

    static public function listar(): array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from contato;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Contato((int) $iterator['idcontato'], $iterator['nome'], $iterator['email'],  $iterator['celular']));
        }

        return $retorno;
    }

    static public function inserir(Contato $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("INSERT into contato(nome, email, celular) values('$param->nome', '$param->email', '$param->celular');");
    }

    public static function atualizar(Contato $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("UPDATE contato SET nome='$param->nome', email='$param->email', celular='$param->celular' where idcontato=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        $temp->conexao->real_query("DELETE from contato where idcontato=$id;");

		return $temp->conexao->affected_rows > 0;
    }
}
