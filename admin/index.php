<?php

if ($_SERVER["REQUEST_METHOD"] === 'POST') {

    $login = $_POST['email'] ?? "";
    $senha = $_POST['senha'] ?? "";

    require_once '../backend/util/funcoes.php';
    strict();
    import('banco/usuario.php');
    import('util/response.php');

    $resultado = Usuario::logar($login, $senha);

    var_dump($resultado . "     " . criptografar($senha, $login) . "        " . $login . "      " . $senha);
    
    if ($resultado){
        session_start();
        $_SESSION["email"] = $login;
        $_SESSION["senha"] = $senha;
        header("location: dashboard.php");
    }
    else
        echo "Login incorreto";

    
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