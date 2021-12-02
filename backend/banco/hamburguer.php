<?php

import("banco/conexao.php");

class Hamburguer {

    public int $id;
    public string $nome;
    public float $valor;
    public int $idimagem;
    public int $idcategoria;
    public ?float $desconto;
    public ?bool $destaque;

    public function __construct(int $id, string $nome, float $valor, int $idcategoria, int $idimagem, ?float $desconto = 0.0, ?bool $destaque = false) {
        $this->id = $id;
        $this->nome = $nome;
        $this->valor = $valor;
        $this->desconto = $desconto;
        $this->destaque = $destaque;
        $this->idimagem = $idimagem;
        $this->idcategoria = $idcategoria;
    }

    public static function buscar(int $id): ?Hamburguer {
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from produto where idproduto=$id;");

        
        
        if ($resultado !== false) {
            $resultado = $resultado->fetch_assoc();
            return new Hamburguer(
                    (int) $resultado['idproduto'],
                    (string) $resultado['nome'],
                    (float) $resultado['valor'],
                    (int) $resultado['idcategoria'],
                    (int) $resultado['idimagem'],
                    (float) $resultado['desconto'],
                    (bool) $resultado['destaque']
            );
        } else {
            return null;
        }
    }

    /**
     * @return array<Hamburguer>
     */
    static public function listar(): array {
        $temp = new Banco();
        $resultado = $temp->conexao->query("SELECT * from produto;");

        $retorno = array();

        if ($resultado !== false) {
            while ($iterator = $resultado->fetch_assoc()) {
                array_push($retorno, new Hamburguer(
                                (int) $iterator['idproduto'],
                                (string) $iterator['nome'],
                                (float) $iterator['valor'],
                                (int) $iterator['idcategoria'],
                                (int) $iterator['idimagem'],
                                (float) $iterator['desconto'],
                                (bool) $iterator['destaque']
                ));
            }
        }

        return $retorno;
    }

    static public function inserir(Hamburguer $param): bool {
        $temp = new Banco();
        return $temp->conexao->query("
                INSERT into produto(nome, valor, desconto, destaque, idimagem, idcategoria) values(
                '$param->nome',
                '$param->valor',
                '$param->desconto',
                $param->destaque,
                $param->idimagem,
                $param->idcategoria
                );
            ");
    }

    public static function deletar(int $id): bool {
        $temp = new Banco();

        $resultado = $temp->conexao->query("SELECT idimagem from produto where idproduto=$id;");
        $resultado = $resultado->fetch_assoc();
        Imagem::deletar((int) $resultado['idimagem']);

        $temp->conexao->query("DELETE from produto where idproduto=$id;");

        return $temp->conexao->affected_rows > 0 && $resultado;
    }
    
    public static function atualizar(Hamburguer $param): bool{
        $temp = new Banco();
        
        error_log("UPDATE produto SET"
                . " nome='$param->nome',"
                . " valor='$param->valor',"
                . " desconto='$param->desconto',"
                . " destaque=$param->destaque,"
                . " idimagem=$param->idimagem,"
                . " idcategoria=$param->idcategoria"
                . " where idproduto=$param->id;");
        
        return $temp->conexao->real_query("UPDATE produto SET"
                . " nome='$param->nome',"
                . " valor='$param->valor',"
                . " desconto='$param->desconto',"
                . " destaque=$param->destaque,"
                . " idimagem=$param->idimagem,"
                . " idcategoria=$param->idcategoria"
                . " where idproduto=$param->id;");
    }

}
