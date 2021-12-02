<?php
    import('util/constantes.php');

    class Banco{
        public mysqli $conexao;
        private string $query = "";
        
        function __construct(){
            $this->conexao = mysqli_connect(HOSTNAME, USUARIO, SENHA, DATABASE);
        }

        function __destruct(){
            mysqli_close($this->conexao);
        }
        
        public static function newInstance(): Banco{
            $s = new Banco();
            
            return $s;
        }
        
        public function inserir(string $onde): Banco{
            
            
            return $this;
        }
}

    