<?php
    $login = $_POST['email'];
    $senha = $_POST['senha'];
    
    $sql = "select * from usuario"
        
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
    </form>
</body>
</html>