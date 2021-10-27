'use strict';

const generateTable = array => {
    let texto = '';

    array.forEach(element => {
        texto += `<tr draggable='true' ondragstart='event.dataTransfer.setData("id", ${element.id});'>
        <td>${element.id}</td>
        <td>${element.nome}</td>
        </tr>`
    });

    return texto;
}

const menu_categorias = async() => {
    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());

    let texto = generateTable(array.resposta);

    janela.innerHTML = `<table>
    <tbody>
        ${texto}
    </tbody>
    </table>`

    let inserir = document.createElement('div');
    let inserirInput = document.createElement('input')
    let inserirEnviar = document.createElement('input')
    let excluir = document.createElement('div')
    
    inserir.id = "inserir";
    
    inserirInput.type = "text"
    inserirInput.id = "inserirInput"
    
    inserirEnviar.type = "button"
    inserirEnviar.id = "inserirEnviar"
    inserirEnviar.value = "Salvar no banco"
    
    excluir.ondragover = e => {e.preventDefault()}
    
    excluir.ondrop = async (e) => {
        let request = new FormData();
            request.append("requisicao", JSON.stringify({ id: event.dataTransfer.getData("id") }));
            request.append("tipo", 'categoria');
            request.append("pedido", 'deletar');

            let hold = new Promise( (yes, no) => {
                
            });

            await fetch("backend/main.php", {
                method: 'post',
                body: request
            }).then(t => console.log(t.text()));
            
            let tbody = janela.querySelector('tbody');
      
            let json = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());
            
            tbody.innerHTML = generateTable(json.resposta);
    }
    
    excluir.id = "excluir"
    
    
    inserir.appendChild(inserirInput);
    inserir.appendChild(inserirEnviar);
    janela.appendChild(inserir);
    janela.appendChild(excluir);
    
    
    
    /*
    <input type='text' id='buttonNome' >
    <input type='button' id='buttonAdicionar' value='enviar' ></input>
    */

    inserirEnviar.addEventListener(
        "click", async () => {
            let request = new FormData();
            request.append("requisicao", JSON.stringify({ nome: inserirInput.value }));
            request.append("tipo", 'categoria');
            request.append("pedido", 'inserir');

            let hold = new Promise( (yes, no) => {
                
            })

            await fetch("backend/main.php", {
                method: 'post',
                body: request
            }).then(t => console.log(t.text()));
            
            let tbody = janela.querySelector('tbody');
      
            let json = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());
            
            tbody.innerHTML = generateTable(json.resposta);
        }
    );
}