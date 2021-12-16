<?php
    require_once '../backend/util/funcoes.php';
    require_once '../backend/banco/Usuario.php';
    require_once '../backend/util/request.php';
    
    if(!Usuario::logar(Request::$cookies['email'] ?? '', Request::$cookies['senha'] ?? ''))
        die;
?>

<!DOCTYPE html>
<html>

<head>
    <title>Dashboard</title>
    <meta charset="UTF-8">

    <link rel="stylesheet" href="../style/fonts/material-icon/material-icon.css">
    <link rel="stylesheet" href="../style/main.css">
    <link rel="stylesheet" href="./style/maindashboard.css">
</head>

<body>
    <header>
        <div id='options'>
            <div>
                <span class="icon">restaurant</span>
                <span class="titulo">Categorias</span>
            </div>
            <div>
                <span class="icon">fastfood</span>
                <span class="titulo">Produtos</span>
            </div>
            <div>
                <span class="icon">contact_page</span>
                <span class="titulo">Contatos</span>
            </div>
            <div>
                <span class="icon">people</span>
                <span class="titulo">Pessoas</span>
            </div>
        </div>
        <div id="logout">logout</div>
    </header>
    <main>
        <placeholder>
            <h2>Página Principal</h2>
            <section>
                <div>
                    <span class="icon">restaurant</span>
                    <h3 class="titulo">Categorias</h3>
                    <table>
                        <tr>
                            <th>Cadastrados</th>
                            <td>69</td>
                        </tr>
                        <tr>
                            <th>Último</th>
                            <td>null</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <span class="icon">fastfood</span>
                    <h3 class="titulo">Produtos</h3>
                    <table>
                        <tr>
                            <th>Cadastrados</th>
                            <td>69</td>
                        </tr>
                        <tr>
                            <th>Último</th>
                            <td>null</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <span class="icon">contact_page</span>
                    <h3 class="titulo">Contatos</h3>
                    <table>
                        <tr>
                            <th>Cadastrados</th>
                            <td>69</td>
                        </tr>
                        <tr>
                            <th>Último</th>
                            <td>null</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <span class="icon">people</span>
                    <h3>Pessoas</h3>
                    <table>
                        <tr>
                            <th>Cadastrados</th>
                            <td>69</td>
                        </tr>
                        <tr>
                            <th>Último</th>
                            <td>null</td>
                        </tr>
                    </table>
                </div>
            </section>
        </placeholder>
    </main>
</body>

</html>