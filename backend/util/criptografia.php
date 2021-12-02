<?php

function criptografar(string $alvo, ?string $salt = null): string {
    return md5($alvo . ($salt !== null ? $salt : ""));
}
