<?php

function criptografar(string $alvo, string ...$salts): string {
    $saltsString = (string) '';

    foreach (($salts ?: array()) as $salt) {
        $saltsString = $saltsString . $salt;
    }

    return md5($saltsString . $alvo);
}
