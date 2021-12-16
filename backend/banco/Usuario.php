<?php

import("banco/Banco.php");
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
        return Banco::inserir("INSERT into usuario(nome, email, senha) values('?', '?', '?');", $param->nome, $param->email, encriptar($param->senha, $param->email));
    }

    static public function buscar(int $id): ?Usuario{
        $resultado = Banco::buscar('SELECT * from usuario where idusuario=?;', $id);

        return $resultado? new Usuario((int) $resultado['idusuario'], $resultado['nome'], $resultado['email'], $resultado['senha']) : null;
    }

    static public function listar(): array{
        $retorno = array();

        foreach (Banco::listar('SELECT * from usuario;') as $iterator) {
            array_push($retorno, new Usuario((int) $iterator['idusuario'], $iterator['nome'], $iterator['email'],  $iterator['senha']));
        }

        return $retorno;
    }

    public static function atualizar(Usuario $param): bool{
        return Banco::atualizar("UPDATE usuario SET nome='$param->nome', email='$param->email', senha='" . encriptar($param->senha, $param->email) . "' where idusuario=$param->id;");
    }

    public static function deletar(int $id): bool{
        return Banco::deletar("DELETE from usuario where idusuario=$id;", $id) > 0;
    }

    public static function logar(string $email, string $senha): bool{
		
        return Banco::buscar("SELECT idusuario from usuario where email='?' and senha='?';", $email, encriptar($senha, $email)) !== null;
    }
}
