'use strict'

const menu_contatos = async () => {
    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json());


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
    generateTableDatasContato(array.resposta)?.forEach(e => tbody.appendChild(e));


    const inserir = document.createElement('div');
    inserir.id = "inserir";

    const inserirInputNome = document.createElement('input')
    inserirInputNome.type = "text"
    inserirInputNome.classList.add('inserirInput');
    inserirInputNome.placeholder = "nome"

    const inserirEnviar = document.createElement('input')
    inserirEnviar.type = "button"
    inserirEnviar.id = "inserirEnviar"
    inserirEnviar.value = "Salvar no banco"
    inserirEnviar.onclick = async () => {
        
            let request = new FormData();
            request.append("requisicao", JSON.stringify({ nome: inserirInputNome.value }));
            request.append("tipo", 'contato');
            request.append("pedido", 'inserir');
            
            await fetch("backend/main.php", {
                method: 'post',
                body: request
            }).then(t => t.json()).then( async json => {

                if(json.ok)
                    regenTableContato(tbody);
                }
            )
        };

    inserir.appendChild(inserirInput);
    inserir.appendChild(inserirEnviar);

    const excluir = document.createElement('div')
    excluir.id = 'excluir'
    excluir.textContent = 'delete'
    excluir.ondragover = e => { e.preventDefault() }
    excluir.ondrop = async (e) => {
        deleteContato(e.dataTransfer.getData("id")).then(ev => {
            fetch('/backend/main.php?tipo=contato&pedido=listar').then(r => r.json()).then(json => {
                clearChildren(tbody)
                generateTableDatasContato(json.resposta)?.forEach(elem => tbody.appendChild(elem));
            });
        });

    }
    
    janela.appendChild(inserir);
    janela.appendChild(excluir);
}

const deleteContato = idIn => {
    const request = new FormData();
        request.append("requisicao", JSON.stringify({ id: idIn }));
        request.append("tipo", 'contato');
        request.append("pedido", 'deletar');

    return fetch("backend/main.php", {
            method: 'post',
            body: request
    }).then(r => r.ok);
}

const editContato = (idIn, nomeIn) => {
    const request = new FormData();
        request.append("requisicao", JSON.stringify({ id: idIn, nome: nomeIn }));
        request.append("tipo", 'contato');
        request.append("pedido", 'atualizar');

    return fetch("backend/main.php", {
            method: 'post',
            body: request
    }).then(r => r.ok);
}



const regenTableContato = async(tbody) => {
    await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json()).then( listJson => {
                        clearChildren(tbody)
                        generateTableDatasContato(listJson.resposta)?.forEach(elem => tbody.appendChild(elem))
    });
}

const editModalContato = (id, nome) => {
    
    
    modal.html(`<table>
        <tr class='fixed'>
            <td>ID</td>
            <td>${id}</td>
        </tr>
        <tr class='editable'>
            <td>Nome</td>
            <td><input type='text' value='${nome}' name="nome"></td>
        </tr>
    </table>
    <div>
        <input value='edit' class='iconeGrande' type='button' onclick="eC(${id}, document.querySelector('input[name=\'\']'))">
        <input value='delete' class='iconeGrande' type='button' onclick="dC(${id})">
    </div>
    `);
    
    document.querySelector("input[value='delete']").onclick = () => {
        deleteContato(id).then(ss => {
            if(ss){
                modal.hide();
                regenTableContato(document.querySelector('#janela > table > tbody'))
            }
    })
    };
    
    document.querySelector("input[value='edit']").onclick = function () {
    editContato(id, document.querySelector('input[name="nome"]').value).then(ss => {
            if(ss){
                modal.hide();
                regenTableContato(document.querySelector('#janela > table > tbody'))
            }
    })
    };

    modal.show();
}

const generateTableDatasContato = array => {
    return array?.map(e => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        const tdNome = document.createElement('td');
        const tdEmail = document.createElement('td');
        const tdCelular = document.createElement('td');

        tr.draggable = true;
        tr.ondragstart = (ev) => ev.dataTransfer.setData("id", e.id);

        tdId.textContent = e.id;
        tdNome.textContent = e.nome;

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        
        tr.onclick = () => editModalContato(e.id, e.nome); 

        return tr;
    });
}
