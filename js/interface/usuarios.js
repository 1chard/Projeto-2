'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';

const start = async () => {
  const janela = document.getElementById('janela');

  const array = await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json());

  janela.innerHTML = `<table>
  <thead>
    <tr>
      <td>Id</td>
      <td>Nome</td>
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

  const inserirEnviar = document.createElement('input');
  inserirEnviar.type = 'button';
  inserirEnviar.id = 'inserirEnviar';
  inserirEnviar.value = 'Salvar no banco';
  inserirEnviar.onclick = async () => {
    if (inserir.reportValidity()) {
      const request = new FormData();
      request.append('requisicao', JSON.stringify({
        nome: inserirInputNome.value
      }));
      request.append('tipo', 'categoria');
      request.append('pedido', 'inserir');

      notif.idle('Enviando requisição', 'A requisição está sendo enviada');

      await fetch('backend/main.php', {
        method: 'post',
        body: request
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

  inserir.append(inserirInputNome, inserirEnviar);

  const excluir = document.createElement('div');
  excluir.id = 'excluir';
  excluir.textContent = 'delete';
  excluir.ondragover = e => { e.preventDefault(); };
  excluir.ondrop = async (e) => {
    deleteData(e.dataTransfer.getData('id')).then(ev => {
      fetch('/backend/main.php?tipo=categoria&pedido=listar').then(r => r.json()).then(json => {
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
  request.append('tipo', 'categoria');
  request.append('pedido', 'deletar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const editData = (id, nome, email, celular) => {
  const request = new FormData();
  request.append('requisicao', JSON.stringify({ id: id, nome: nome, email: email, celular: celular }));
  request.append('tipo', 'categoria');
  request.append('pedido', 'atualizar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const regenTable = async (tbody) => {
  await fetch('/backend/main.php?tipo=categoria&pedido=listar').then(t => t.json()).then(listJson => {
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

  divNome.append(nomeNome, nomeValor);
  mainDiv.appendChild(divNome);

  // depois a div
  const sendDiv = document.createElement('div');

  const editInput = document.createElement('input');
  editInput.type = 'button';
  editInput.value = 'edit';
  editInput.onclick = () => {
    if (form.reportValidity()) {
      editData(
        id,
        nomeValor.value
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

    tr.draggable = true;
    tr.ondragstart = (ev) => ev.dataTransfer.setData('id', e.id);

    tdId.textContent = e.id;
    tdNome.textContent = e.nome;

    tr.append(tdId, tdNome);

    tr.onclick = () => editModal(e.id, e.nome);

    return tr;
  });
};

export { start };
export default start;
