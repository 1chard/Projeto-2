<?php

import("banco/conexao.php");
import("util/criptografia.php");

class Usuario
{
    public int $id;
    public string $nome;
    public string $email;
    public string $senha;
    
    public function __construct(int $id, string $nome, string $email, string $senha){
            $this->nome = $nome;
            $this->id = $id;
            $this->email = $email;
            $this->senha = $senha;
    }

    static public function inserir(Usuario $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("INSERT into usuario(nome, email, senha) values('$param->nome', '$param->email', '" . criptografar($param->senha, $param->email) . "');");
    }

    static public function buscar(int $id): ?Usuario{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from usuario where idusuario=$id;")->fetch_assoc();

        return $resultado? new Usuario((int) $resultado['idusuario'], $resultado['nome'], $resultado['email'], $resultado['senha']) : null;
    }

    static public function listar(): array{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from usuario;");

        $retorno = array();

        while ($iterator = $resultado->fetch_assoc()) {
            array_push($retorno, new Usuario((int) $iterator['idusuario'], $iterator['nome'], $iterator['email'],  $iterator['senha']));
        }

        return $retorno;
    }

    public static function atualizar(Usuario $param): bool{
        $temp = new Banco();
        return $temp->conexao->real_query("UPDATE usuario SET nome='$param->nome', email='$param->email', senha='" . criptografar($param->senha, $param->email) . "' where idusuario=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        $temp->conexao->query("DELETE from usuario where idusuario=$id;");

		return $temp->conexao->affected_rows > 0;
    }

    public static function logar(Usuario $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("SELECT idusuario from usuario where email='$param->email' and senha='" . criptografar($param->senha, $param->email) . "';")->fetch_assoc() !== null;
    }
}
