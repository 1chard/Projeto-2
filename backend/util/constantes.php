<?php
    strict();

    if($_SERVER['DOCUMENT_ROOT'] === '/home/richard/Documentos/Projeto-2'){
        define('HOSTNAME', 'localhost');
        define('USUARIO', 'richard');
        define('SENHA', '123');
        define('DATABASE', 'hamburgueria2021');
    }
    else{
        define('HOSTNAME', 'localhost');
        define('USUARIO', 'root');
        define('SENHA', 'bcd127');
        define('DATABASE', 'hamburgueria2021');
    }
