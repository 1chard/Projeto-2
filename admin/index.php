<?php

if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    $login = $_POST['email'] ?? "";
    $senha = $_POST['senha'] ?? "";

    require_once '../backend/util/funcoes.php';
    strict();
    import('banco/Usuario.php');
    import('util/response.php');
	import('util/criptografia.php');
    $resultado = Usuario::logar($login, $senha);

    if ($resultado){
        Response::addGlobalCookie("email", $login, 86400000);
        Response::addGlobalCookie("senha", $senha, 86400000);
		Response::sendRediretion("/dashboard.php");
    }
    else
        echo "Login incorreto";

	var_dump($resultado . "     " . encriptar($senha, $login) . "        " . $login . "      " . $senha);
    
}
?>

<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>login</title>
    </head>
    <body>
        <form action="" method="post">
            <label for="email">Email</label>
            <input name="email" id="email">
            <label for="senha">Senha</label>
            <input name="senha" id="senha">
            <input type='submit'>
        </form>
    </body>
</html>