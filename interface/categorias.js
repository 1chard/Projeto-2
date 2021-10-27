'use strict';

const menu_categorias = async() => {
    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then( t => t.json()) ?? [];

    let texto = '';

    array.resposta.forEach(element => {
        texto += `<tr>
        <td>${element.id}</td>
        <td>${element.nome}</td>
        </tr>`
    });

    janela.innerHTML = `<table>
    <tbody>
        ${texto}
    </tbody>
    </table>
    
    <input type='text' id='buttonNome' >
    <input type='button' id='buttonAdicionar' value='enviar' >`
    
    janela.querySelector('#buttonAdicionar').addEventListener(
        "click", () => {
            let request = new FormData();
            request.append("requisicao", JSON.stringify({ nome: document.getElementById("buttonNome").value }));
            request.append("tipo", 'categoria');
            request.append("pedido", 'inserir');
            
            fetch("backend/main.php", {method: 'post',
                                        body: request } ).then(t => console.log(t.text()));
            /*
                JSON.stringify({
                                            requisicao: JSON.stringify({ nome: document.getElementById("buttonNome").value}),
                                            tipo: "categoria",
                                            pedido: "inserir"
                                            }),
                                        headers: { "Content-Type": "application/json"}

            */


        }
    );
}