<?php

function strict() {
    mysqli_report(MYSQLI_REPORT_ALL);

    set_error_handler(function ($severity, $message, $file, $line): void {
        if ( !((E_ALL & $severity)) ) {
            return;
        }
        throw new ErrorException($message, 0, $severity, $file, $line);
    });
}


function import(string $toImport) {
    require_once filter_input(INPUT_SERVER, 'DOCUMENT_ROOT') . '/backend/' . $toImport;
}