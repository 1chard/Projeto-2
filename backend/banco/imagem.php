<?php

class Imagem {
    public $id = null;
    public $nome = '';

    public function __construct(int $id, string $nome) {
        $this->nome = $nome;
        $this->id = $id;
    }

    static public function inserir(Imagem $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("INSERT into imagem(nome) values('$param->nome');");
    }

    static public function buscar(int $id): ?Imagem{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from imagem where idimagem=$id;")->fetch_assoc();

        return $resultado? new Imagem((int) $resultado['idimagem'], $resultado['nome']) : null;
    }
    
    static public function buscarPorNome(string $nome): ?Imagem{
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from imagem where nome=$nome;")->fetch_assoc();

        return $resultado? new Imagem((int) $resultado['idimagem'], $resultado['nome']) : null;
    }

    public static function atualizar(Imagem $param): bool{
        $temp = new Banco();
        return $temp->conexao->query("UPDATE imagem SET nome='$param->nome' where idimagem=$param->id;");
    }

    public static function deletar(int $id): bool{
        $temp = new Banco();
        return $temp->conexao->query("DELETE from imagem where idimagem=$id;");
    }
}
