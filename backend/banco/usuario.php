<?php

import("banco/conexao.php");
import("util/criptografia.php");

class Usuario
{
    public $id = null;
    public $nome = '';
    public $email = '';
    public $senha = '';

    public function __construct(int $id, string $nome, string $email, string $senha ){
            $this->nome = $nome;
            $this->id = $id;
            $this->email = $email;
            $this->senha = $senha;
    }

    static public function inserir(Usuario $param): bool{
        $temp = new Banco();
        return mysqli_query($temp->conexao, "INSERT into usuario(nome, email, senha) values('$param->nome', '$param->email', '". criptografar($param->senha) ."');");
    }

    static public function buscar(int $id): ?Usuario{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from usuario where idusuario=$id;")->fetch_assoc();

        return $resultado? new Usuario((int) $resultado['idusuario'], $resultado['nome'], $resultado['email'], $resultado['senha']) : null;
    }

    static public function listar(): ?array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from usuario;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Usuario((int) $iterator['idusuario'], $iterator['nome'], $iterator['email'],  $iterator['senha']));
        }

        return (count($retorno) > 0)? $retorno : null;
    }

    public static function atualizar(Usuario $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("UPDATE usuario SET nome='$param->nome', email='$param->email', senha='$param->senha' where idusuario=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        return $temp->conexao->query("DELETE from usuario where idusuario=$id;");
    }
}
