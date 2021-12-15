<?php

	class Request{
		public static function getBody(): string{
			return file_get_contents('php://input');
		}

		public static array $parameters;
		public static array $querys;
		public static array $cookies;
	}

	Request::$querys =& $_GET;
	Request::$parameters = isset($_SERVER['PATH_INFO'])? explode("/", substr($_SERVER['PATH_INFO'], 1)) : [];
	Request::$cookies =& $_COOKIE;
