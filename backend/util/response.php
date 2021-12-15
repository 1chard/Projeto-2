<?php

    class Response{
        public static function setStatus(int $status): void{
            http_response_code($status);
        }

        public static function addCookie(string $chave, string $valor, int $duracao, string $pastarelativa): void{
            setcookie($chave, $valor, $duracao, $pastarelativa);
        }

        public static function addGlobalCookie(string $chave, string $valor, int $duracao): void{
            self::addCookie($chave, $valor, $duracao, "/");
        }
    }