<?php
    import('util/constantes.php');

    class Banco{
        public $conexao = null;

        function __construct(){
            $this->conexao = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
        }

        function __destruct(){
            mysqli_close($this->conexao);
        }
    }

    