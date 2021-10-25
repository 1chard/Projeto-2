<?php
    function import(string $toImport)  {
        require_once( $_SERVER['DOCUMENT_ROOT'].'/backend/'.$toImport);
    }

    import('banco/hamburguer.php');
    import('util/constantes.php');

    var_dump(Hamburguer::buscar(1));

