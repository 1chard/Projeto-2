<?php



class Hamburguer {
    public $id = 0;
    public $nome = '';
    public $categoria = '';
    public $preco = 0.0;
    public $desconto = null;
    public $descricao = null;
    
    public function __construct(array $array) {
        $this->id = $array['idhamburguer'];
        $this->nome = $array['nome'];
        $this->categoria = $array['categoria'];
        $this->preco = $array['preco'];
        $this->desconto = $array['desconto'];
        $this->descricao = $array['descricao'];
    }
    
    static public function inserir(Hamburguer $param):bool {
        $temp = new Banco();
        
        return mysqli_query($temp->conexao, "insert into hamburguer(nome, categoria, preco, desconto ,descricao)"
                . " values($param->nome, $param->categoria, $param->preco, $param->desconto, $param->descricao);")
                ? true : false;
    }
    
    
    
    static public function buscar(int $id){
        echo 'fjdlf';
        
        $retorno = null;
        $temp = new Banco();
        $resultado = mysqli_query($temp->conexao, "select * from hamburguer where "
                . "idhamburguer=$id;");
        
        var_dump(mysqli_fetch_assoc($resultado));
        
       
        
        return null;        
    }

}