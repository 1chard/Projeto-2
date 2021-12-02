<?php



if ($_SERVER["REQUEST_METHOD"] === 'POST') {

    $login = $_POST['email'] ?? "";
    $senha = $_POST['senha'] ?? "";

    require_once '../backend/main.php';
    require_once '../backend/banco/usuario.php';

    $resultado = Usuario::logar(new Usuario(0, null, $login, $senha));

    var_dump($resultado . "     " . criptografar($login, $senha) . "        " . $login . "      " . $senha);
    
    if ($resultado)
        header("location: dashboard.html");
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