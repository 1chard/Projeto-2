<?php
    //include_once './banco/conexao.php';
    //include_once './banco/hamburguer.php';
    include_once './util/constantes.php';

    echo 'fffff';
    mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
    
    Hamburguer::buscar(0);

