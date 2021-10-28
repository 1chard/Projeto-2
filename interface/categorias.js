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

const menu_categorias = async () => {
    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());

    let texto = generateTable(array.resposta);

    janela.innerHTML = `<table>
    <tbody>
        ${texto}
    </tbody>
    </table>`

    const tbody = janela.querySelector('tbody');


    const inserir = document.createElement('div');
    inserir.id = "inserir";

    const inserirInput = document.createElement('input')
    inserirInput.type = "text"
    inserirInput.id = "inserirInput"

    const inserirEnviar = document.createElement('input')
    inserirEnviar.type = "button"
    inserirEnviar.id = "inserirEnviar"
    inserirEnviar.value = "Salvar no banco"

    const excluir = document.createElement('div')
    excluir.id = 'excluir'
    excluir.textContent = 'trash'
    excluir.ondragover = e => { e.preventDefault() }
    excluir.ondrop = async (e) => {
        const request = new FormData();
        request.append("requisicao", JSON.stringify({ id: e.dataTransfer.getData("id") }));
        request.append("tipo", 'categoria');
        request.append("pedido", 'deletar');

        let finished = false;
        

        await fetch("backend/main.php", {
            method: 'post',
            body: request
        }).then(ev => {
            fetch('/backend/main.php?tipo=categoria&pedido=listar').then(r => r.json()).then( json => {
                tbody.innerHTML = generateTable(json.resposta);
            });
        }).catch( e => {

        });


    }



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

            let hold = new Promise((yes, no) => {

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