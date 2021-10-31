'use strict';

import notif from "../util/notification.js";
import modal from "../util/modal.js";
import { createInputFromCallbacks, createInputFromRegex } from "../util/input.js";

const start = async () => {

    const janela = document.getElementById('janela');

    let array = await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json());

    janela.innerHTML = `<table>
    <thead>
        <tr>
            <td>Id</td>
            <td>Nome</td>
            <td>Email</td>
            <td>Celular</td>
        </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`

    const tbody = janela.querySelector('tbody');
    generateTableDatasContato(array.resposta)?.forEach(e => tbody.appendChild(e));

    const inserir = document.createElement('form');
    inserir.id = "inserir";

    const inserirInputNome = document.createElement('input')
    inserirInputNome.type = "text"
    inserirInputNome.classList.add('inserirInput');
    inserirInputNome.placeholder = "nome"

    const inserirInputEmail = document.createElement('input')
    inserirInputEmail.type = "email"
    inserirInputEmail.classList.add('inserirInput');
    inserirInputEmail.placeholder = "email"

    const inserirInputCelular = createInputFromRegex('Esse número não é válido.\n Insira um número no formato "(01) 23456-7890" ou "01234567890".', /^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/);
    inserirInputCelular.type = "tel"
    inserirInputCelular.classList.add('inserirInput')
    inserirInputCelular.placeholder = "celular"
    inserirInputCelular.reportValidity();


    const inserirEnviar = document.createElement('input')
    inserirEnviar.type = "button"
    inserirEnviar.id = "inserirEnviar"
    inserirEnviar.value = "Salvar no banco"
    inserirEnviar.onclick = async () => {
        let rnome = /^[A-z\s]{3,100}$/.test(inserirInputNome.value)
        let remail = /^[A-z\d]+\@[A-z\d]+$/.test(inserirInputEmail.value) && inserirInputEmail.value.length < 60
        let rcelular = /^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/.test(inserirInputCelular.value)

        console.log(rnome + ' ' + remail + ' ' + rcelular)

        if (inserir.reportValidity()) {
            let celparse = ''

            for (const s of inserirInputCelular.value.match(/\d+/g))
                celparse += s;

            console.log(celparse);

            let request = new FormData();
            request.append("requisicao", JSON.stringify({
                nome: inserirInputNome.value,
                email: inserirInputEmail.value,
                celular: celparse
            }));
            request.append("tipo", 'contato');
            request.append("pedido", 'inserir');

            notif.idle("Enviando requisição", "A requisição está sendo enviada");

            await fetch("backend/main.php", {
                method: 'post',
                body: request
            }).then(t => {
                notif.stopIdle()
                if (t.ok)
                    return t.json()
                else
                    notif.error("Falha", "Erro na conexao: " + t.status);

            })?.then(async json => {
                if (json.ok) {
                    notif.message("Sucesso", "Enviado com sucesso")
                    regenTableContato(tbody);
                }
                else
                    notif.warning("Aviso", "Erro nas informações");
            })

        }
        else
            notif.error("Erro", "Alguns campos não estão preenchidos corretamente")
    };

    inserir.appendChild(inserirInputNome);
    inserir.appendChild(inserirInputEmail);
    inserir.appendChild(inserirInputCelular);
    inserir.appendChild(inserirEnviar);

    const excluir = document.createElement('div')
    excluir.id = 'excluir'
    excluir.textContent = 'delete'
    excluir.ondragover = e => { e.preventDefault() }
    excluir.ondrop = async (e) => {
        deleteContato(e.dataTransfer.getData("id")).then(ev => {
            fetch('/backend/main.php?tipo=contato&pedido=listar').then(r => r.json()).then(json => {
                while (tbody.firstChild)
                    tbody.firstChild.remove();

                generateTableDatasContato(json.resposta)?.forEach(elem => tbody.appendChild(elem));
            });
        });

    }

    janela.appendChild(inserir);
    janela.appendChild(excluir);
}

const deleteContato = id => {
    const request = new FormData();
    request.append("requisicao", JSON.stringify({ id: id }));
    request.append("tipo", 'contato');
    request.append("pedido", 'deletar');

    return fetch("backend/main.php", {
        method: 'post',
        body: request
    }).then(r => r.ok);
}

const editContato = (id, nome, email, celular) => {
    const request = new FormData();
    request.append("requisicao", JSON.stringify({ id: id, nome: nome, email: email, celular: celular }));
    request.append("tipo", 'contato');
    request.append("pedido", 'atualizar');

    return fetch("backend/main.php", {
        method: 'post',
        body: request
    }).then(r => r.ok);
}



const regenTableContato = async (tbody) => {
    await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json()).then(listJson => {
        while (tbody.firstChild)
            tbody.firstChild.remove();

        generateTableDatasContato(listJson.resposta)?.forEach(elem => tbody.appendChild(elem))
    });
}

const editModalContato = (id, nome, email, contato) => {
    modal.html(`<table>
        <tr class='fixed'>
            <td>ID</td>
            <td>${id}</td>
        </tr>
        <tr class='editable'>
            <td>Nome</td>
            <td><input type='text' value='${nome}' name="nome"></td>
        </tr>
        <tr class='editable'>
            <td>Email</td>
            <td><input type='text' value='${email}' name="email"></td>
        </tr>
        <tr class='editable'>
            <td>Contato</td>
            <td><input type='text' value='${contato}' name="celular"></td>
        </tr>
    </table>
    <div>
        <input value='edit' class='iconeGrande' type='button'">
        <input value='delete' class='iconeGrande' type='button'">
    </div>
    `);

    

    document.querySelector("input[value='delete']").onclick = () => {
        deleteContato(id).then(ss => {
            if (ss) {
                modal.hide();
                regenTableContato(document.querySelector('#janela > table > tbody'));
            }
        })
    };

    document.querySelector("input[value='edit']").onclick = function () {
        editContato(
            id,
            document.querySelector('input[name="nome"]').value,
            document.querySelector('input[name="email"]').value,
            document.querySelector('input[name="celular"]').value
        ).then(ok => {
            if (ok) {
                modal.hide();
                regenTableContato(document.querySelector('#janela > table > tbody'));
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
        tdEmail.textContent = e.email;
        tdCelular.textContent = e.celular;

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tr.appendChild(tdCelular);

        tr.onclick = () => editModalContato(e.id, e.nome, e.email, e.celular);

        return tr;
    });
}

export { start };
export default start;