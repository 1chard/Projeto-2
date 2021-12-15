<?php
    require_once 'backend/util/funcoes.php';
    require_once 'backend/banco/usuario.php';
    require_once 'backend/util/request.php';

    session_start();
    
    if(!Usuario::logar($_SESSION['email'] ?? '', $_SESSION['senha'] ?? ''))
        die;
?>

<!DOCTYPE html>
<html>

<head>
    <title>Dashboard</title>
    <meta charset="UTF-8">

    <link rel="stylesheet" href="style/fonts/material-icon.css">
    <link rel="stylesheet" href="style/fonts/material-icon-outlined.css">
    <link rel="stylesheet" href="style/main.css">
    <link rel="stylesheet" href="style/fonts/roboto.css">
    <link rel="stylesheet" href="style/header_dashboard.css">
    <link rel="stylesheet" href="style/main_dashboard.css">
    <link rel="stylesheet" href="style/menu_dashboard.css">
    <link rel="stylesheet" href="style/fixed_dashboard.css">

    <script src="js/dashboard.js" type="module"></script>
    <script type="module">
		import $ from "../js/jquery.js";
		
		window.$ = $;
	</script>
</head>

<body>

    <header>
        <span id="mudaTema">light_mode</span>
        <span id="sair">logout</span>
    </header>
    <main>

        <nav id="categorias">
            <button data-alvo="produtos">
                <span class="iconeGrande">
                    lunch_dining
                </span>
                <span class='titulo'>
                    Produtos
                </span>
            </button>
            <button data-alvo="categorias">

                <span class="iconeGrande">
                    fastfood
                </span>
                <span class='titulo'>
                    Categorias
                </span>
            </button>
            <button data-alvo="contatos">    

                <span class="iconeGrande">
                    contact_page
                </span>
                <span class='titulo'>
                    Contatos
                </span>
            </button>
            <button data-alvo="usuarios">

                <span class="iconeGrande">
                    group
                </span>
                 <span class='titulo'>
                    Usuario
                </span>
            </button>
        </nav>
        <section id="janela">
            
        </section>
    </main>
    <footer>
        <p>
            &copy; 1chard
        </p>
    </footer>
    <script defer>
        
    </script>
</body>

</html>