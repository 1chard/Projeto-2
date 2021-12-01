<?php
    $login = $_POST['email'] ?? null;
    $senha = $_POST['senha'] ?? null;
    
    require_once '../backend/main.php';
    require_once '../backend/banco/usuario.php';

    $resultado = Usuario::logar(new Usuario(0, null, $email, $senha));
    
    var_dump($resultado)

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
    </form>
</body>
</html>