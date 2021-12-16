<?php
    class Response{
        public static function setStatus(int $status): void{
            http_response_code($status);
        }

        public static function addCookie(string $chave, string $valor, int $duracao, string $pastarelativa = ""): void{
            setcookie($chave, $valor, time() + $duracao,  $pastarelativa ?: $_SERVER['PATH_INFO'] ?: '/');
        }

        public static function addGlobalCookie(string $chave, string $valor, int $duracao): void{
            self::addCookie($chave, $valor, $duracao, "/");
        }

		public static function sendRediretion(string $location, int $status = 307): void{
			header("location: dashboard.php");
			self::setStatus($status);
		}
    }