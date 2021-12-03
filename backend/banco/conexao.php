<?php

import('util/constantes.php');

class Banco {

    public mysqli $conexao;

    const MODO_INSERIR = 1;

    function __construct() {
        $this->conexao = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
    }

    function __destruct() {
        mysqli_close($this->conexao);
    }

    public static function newInstance(): Banco {
        $s = new Banco();

        return $s;
    }
    
    public function inserir(string $onde, array $campos, array $valores): bool {
        $strcampos = "";
        $strvalores = "";

        foreach ($campos as $campo) {
            $strcampos .= "$campo,";
            $strvalores .= "?,";
        }
        
        $strcampos[strlen($strcampos) - 1] = " ";
        $strvalores[strlen($strvalores) - 1] = " ";
        
        echo "INSERT into $onde($strcampos) VALUES($strvalores)";

        $stmt = $this->conexao->prepare("INSERT into $onde($strcampos) VALUES($strvalores)");

        $chars = "";

        foreach ($valores as $valorIterator) {
            $chars .= self::char($valorIterator);
        }

        $stmt->bind_param($chars, ...$valores);
            return $stmt->execute();
    }
    
    public function buscar(mixed $onde, string $extra = ""): array {
        $strcampos = "";
        $stronde = "";
        $straonde = "";

        foreach ($campos as $campo) {
            $strcampos .= "$campo,";
            $strvalores .= "?,";
        }
        
        $strcampos[strlen($strcampos) - 1] = " ";
        $strvalores[strlen($strvalores) - 1] = " ";
        
        echo "INSERT into $onde($strcampos) VALUES($strvalores)";

        $stmt = $this->conexao->prepare("INSERT into $onde($strcampos) VALUES($strvalores)");

        $chars = "";

        foreach ($valores as $valorIterator) {
            $chars .= self::char($valorIterator);
        }

        $stmt->bind_param($chars, ...$valores);
            return $stmt->execute();
    }

    private static function char($test) : string{
        if (is_int($test))
            return 'i';
        else if (is_float($test))
            return 'd';
        else
            return 's';
    }

}
