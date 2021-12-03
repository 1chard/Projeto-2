<?php

function strict() {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    error_reporting(E_ALL);

    set_error_handler(function ($severity, $message, $file, $line) {
        throw new ErrorException($message, 0, $severity, $file, $line);
    });
}


function import(string $toImport) {
    require_once filter_input(INPUT_SERVER, 'DOCUMENT_ROOT') . '/backend/' . $toImport;
}