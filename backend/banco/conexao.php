<?php
    include_once '../util/constantes.php';

    class Banco{
        public $conexao = null;

        function __construct(){
            $this->banco = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
        }
    }

    