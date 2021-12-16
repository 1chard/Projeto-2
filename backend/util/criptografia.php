<?php

function encriptar(string $alvo, ?string $salt = null): string {
    return md5($alvo . ($salt !== null ? $salt : ""));
}

function basear(string $alvo): string{
	return base64_encode(strrev($alvo));
}

function desbasear(string $base): string{
	return strrev(base64_decode($base));
}

/*
$retorno = '';

	for($i = strlen($alvo) - 1; $i > 0; $i--){
		$byte = ord($alvo[$i]) ;

		$retorno .= (($byte << 1) & 255) | ($byte >> 7);
	}

	return strrev($alvo);
*/