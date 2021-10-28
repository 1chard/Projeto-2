'use strict';

const generateTableDatas = array => {
    return array?.map(e => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        const tdNome = document.createElement('td');

        tr.draggable = true;
        tr.ondragstart = (ev) => ev.dataTransfer.setData("id", e.id);

        tdId.textContent = e.id;
        tdNome.textContent = e.nome;

        tr.appendChild(tdId);
        tr.appendChild(tdNome);

        return tr;
    });
}

const clearChildren = (dom) => {
    while (dom.firstChild)
        dom.firstChild.remove();
}

const menu_categorias = async () => {
    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());


    janela.innerHTML = `<table>
    <thead>
        <tr>
            <td>Id</td>
            <td>Nome</td>
        </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`

    const tbody = janela.querySelector('tbody');
    generateTableDatas(array.resposta)?.forEach(e => tbody.appendChild(e));


    const inserir = document.createElement('div');
    inserir.id = "inserir";

    const inserirInput = document.createElement('input')
    inserirInput.type = "text"
    inserirInput.id = "inserirInput"

    const inserirEnviar = document.createElement('input')
    inserirEnviar.type = "button"
    inserirEnviar.id = "inserirEnviar"
    inserirEnviar.value = "Salvar no banco"
    inserirEnviar.onclick = async () => {
            let request = new FormData();
            request.append("requisicao", JSON.stringify({ nome: inserirInput.value }));
            request.append("tipo", 'categoria');
            request.append("pedido", 'inserir');
            
            await fetch("backend/main.php", {
                method: 'post',
                body: request
            }).then(t => t.json()).then( async json => {

                if(json.ok){
                    await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json()).then( listJson => {
                        clearChildren(tbody)
                        generateTableDatas(listJson.resposta)?.forEach(elem => tbody.appendChild(elem));
                    });
                }

            })
        };

    const excluir = document.createElement('div')
    excluir.id = 'excluir'
    excluir.textContent = 'delete'
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
            fetch('/backend/main.php?tipo=categoria&pedido=listar').then(r => r.json()).then(json => {

                clearChildren(tbody)
                generateTableDatas(json.resposta)?.forEach(elem => tbody.appendChild(elem));
            });
        }).catch(e => {

        });


    }



    inserir.appendChild(inserirInput);
    inserir.appendChild(inserirEnviar);
    janela.appendChild(inserir);
    janela.appendChild(excluir);

    
}