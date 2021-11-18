'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { createInputFromCallbacks } from '../util/input.js';
import { ajax } from '../util/extra.js';

const start = async () => {
  const janela = document.getElementById('janela');

  const array = await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json());

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
    </table>`;

  const tbody = janela.querySelector('tbody');
  generateTableDatas(array.resposta)?.forEach(e => tbody.appendChild(e));

  const inserir = document.createElement('form');
  inserir.id = 'inserir';

  const inserirInputNome = document.createElement('input');
  inserirInputNome.type = 'text';
  inserirInputNome.classList.add('inserirInput');
  inserirInputNome.placeholder = 'nome';
  inserirInputNome.required = true;
  inserirInputNome.minLength = 3;
  inserirInputNome.maxLength = 100;
  inserirInputNome.autocomplete = 'username';

  const inserirInputEmail = document.createElement('input');
  inserirInputEmail.type = 'email';
  inserirInputEmail.classList.add('inserirInput');
  inserirInputEmail.placeholder = 'email';
  inserirInputEmail.required = true;
  inserirInputEmail.maxLength = 60;
  inserirInputEmail.autocomplete = 'email';

  const inserirInputCelular = createInputFromCallbacks(
    value => (/[^\d()\-\s]/g).test(value) ? 'Um número não pode conter letras ou caracteres além de ( ) -' : '',
    value => value.length < 10 ? 'Insira um número com dez ou onze dígitos' : '',
    value => !(/^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/).test(value) ? 'Esse número não é válido' : ''
  );
  inserirInputCelular.type = 'tel';
  inserirInputCelular.classList.add('inserirInput');
  inserirInputCelular.placeholder = 'celular';
  inserirInputCelular.required = true;
  inserirInputCelular.maxLength = 20;
  inserirInputCelular.autocomplete = 'tel';

  const inserirEnviar = document.createElement('input');
  inserirEnviar.type = 'button';
  inserirEnviar.id = 'inserirEnviar';
  inserirEnviar.value = 'Salvar no banco';
  inserirEnviar.onclick = async () => {
    if (inserir.reportValidity()) {
      const request = new FormData();
      request.append('requisicao', JSON.stringify({

      }));

      notif.idle('Enviando requisição', 'A requisição está sendo enviada');

      await fetch('backend/main.php', {
        info: {
          nome: inserirInputNome.value,
          email: inserirInputEmail.value,
          celular: parseCelular(inserirInputCelular.value)
        },
        tipo: 'contato',
        pedido: 'inserir'
      }).then(t => {
        notif.stopIdle();
        if (t.ok) {
          return t.json();
        } else {
          notif.error('Falha', 'Erro na conexao: ' + t.status);
        }
      })?.then(async json => {
        if (json.ok) {
          notif.message('Sucesso', 'Enviado com sucesso');
          regenTable(tbody);
        } else {
          notif.warning('Aviso', 'Erro nas informações');
        }
      });
    } else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
  };

  inserir.append(inserirInputNome, inserirInputEmail, inserirInputCelular, inserirEnviar);

  const excluir = document.createElement('div');
  excluir.id = 'excluir';
  excluir.textContent = 'delete';
  excluir.ondragover = e => { e.preventDefault(); };
  excluir.ondrop = async (e) => {
    deleteData(e.dataTransfer.getData('id')).then(() => {
      fetch('/backend/main.php?tipo=contato&pedido=listar').then(r => r.json()).then(json => {
        tbody.innerHTML = '';

        generateTableDatas(json.resposta)?.forEach(elem => tbody.appendChild(elem));
      });
    });
  };

  janela.appendChild(inserir);
  janela.appendChild(excluir);
};

const deleteData = id => {
  const request = new FormData();
  request.append('requisicao', JSON.stringify({ id: id }));
  request.append('tipo', 'contato');
  request.append('pedido', 'deletar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const editData = (id, nome, email, celular) => {
  const request = new FormData();
  request.append('requisicao', JSON.stringify({ id: id, nome: nome, email: email, celular: celular }));
  request.append('tipo', 'contato');
  request.append('pedido', 'atualizar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const regenTable = async (tbody) => {
  await fetch('/backend/main.php?tipo=contato&pedido=listar').then(t => t.json()).then(listJson => {
    while (tbody.firstChild) { tbody.firstChild.remove(); }

    generateTableDatas(listJson.resposta)?.forEach(elem => tbody.appendChild(elem));
  });
};

const editModal = (id, nome, email, celular) => {
  modal.clear();

  const form = document.createElement('form');
  const mainDiv = document.createElement('div');
  mainDiv.id = 'mainDiv';

  // tr do id
  const divId = document.createElement('div');

  const idNome = document.createElement('div');
  idNome.innerText = 'ID';

  const idValor = document.createElement('div');
  idValor.innerHTML = id;

  divId.append(idNome, idValor);
  mainDiv.appendChild(divId);

  // tr do nome
  const divNome = document.createElement('div');

  const nomeNome = document.createElement('div');
  nomeNome.innerText = 'Nome';

  const nomeValor = document.createElement('input');
  nomeValor.placeholder = 'nome';
  nomeValor.required = true;
  nomeValor.minLength = 3;
  nomeValor.maxLength = 100;
  nomeValor.value = nome;
  nomeValor.autocomplete = 'username';

  divNome.append(nomeNome, nomeValor);
  mainDiv.appendChild(divNome);

  // tr do email
  const divEmail = document.createElement('div');

  const emailNome = document.createElement('div');
  emailNome.innerText = 'Email';

  const emailValor = document.createElement('input');
  emailValor.type = 'email';
  emailValor.placeholder = 'email';
  emailValor.required = true;
  emailValor.maxLength = 60;
  emailValor.value = email;
  emailValor.autocomplete = 'email';

  divEmail.append(emailNome, emailValor);
  mainDiv.appendChild(divEmail);

  // tr do numero
  const divCelular = document.createElement('div');

  const celularNome = document.createElement('div');
  celularNome.innerText = 'Celular';

  const celularValor = createInputFromCallbacks(
    value => (/[^\d\(\)\-\s]/g).test(value) ? 'Um número não pode conter letras ou caracteres além de ( ) -' : '',
    value => value.length < 10 ? 'Insira um número com dez ou onze dígitos' : '',
    value => !(/^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/).test(value) ? 'Esse número não é válido' : ''
  );
  celularValor.type = 'tel';
  celularValor.placeholder = 'celular';
  celularValor.required = true;
  celularValor.maxLength = 20;
  celularValor.value = unparseCelular(celular);
  celularValor.autocomplete = 'tel';

  divCelular.append(celularNome, celularValor);
  mainDiv.appendChild(divCelular);

  // depois a div
  const sendDiv = document.createElement('div');

  const editInput = document.createElement('input');
  editInput.type = 'button';
  editInput.value = 'edit';
  editInput.onclick = () => {
    if (form.reportValidity()) {
      editData(
        id,
        nomeValor.value,
        emailValor.value,
        parseCelular(celularValor.value)
      ).then(ok => {
        if (ok) {
          regenTable(document.querySelector('#janela > table > tbody')).then(() => modal.hide());
        }
      });
    } else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
  };

  const deleteInput = document.createElement('input');
  deleteInput.type = 'button';
  deleteInput.value = 'delete';
  deleteInput.onclick = () => {
    deleteData(id).then(ss => {
      if (ss) {
        regenTable(document.querySelector('#janela > table > tbody')).then(() => modal.hide());
      }
    });
  };
  sendDiv.append(editInput, deleteInput);
  sendDiv.id = 'sendDiv';

  form.append(mainDiv, sendDiv);
  modal.append(form);
  modal.show();
};

const generateTableDatas = array => {
  return array?.map(e => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    const tdNome = document.createElement('td');
    const tdEmail = document.createElement('td');
    const tdCelular = document.createElement('td');

    tr.draggable = true;
    tr.ondragstart = (ev) => ev.dataTransfer.setData('id', e.id);

    tdId.textContent = e.id;
    tdNome.textContent = e.nome;
    tdEmail.textContent = e.email;
    tdCelular.textContent = unparseCelular(e.celular);

    tr.append(tdId, tdNome, tdEmail, tdCelular);

    tr.onclick = () => editModal(e.id, e.nome, e.email, e.celular);

    return tr;
  });
};

const unparseCelular = val => {
  return `(${val.substr(0, 2)}) ${val.substr(2, val.length - 6)}-${val.substr(val.length - 4)}`;
};

const parseCelular = val => {
  let celparse = '';
  val.match(/\d+/g).forEach(s => celparse += s);
  return celparse;
};

export { start };
export default start;
