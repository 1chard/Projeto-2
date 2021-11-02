'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { createInputFromCallbacks } from '../util/input.js';

const start = async () => {
  const janela = document.getElementById('janela');

  const array = await fetch('/backend/main.php?tipo=usuario&pedido=listar').then(t => t.json());

  janela.innerHTML = `<table>
  <thead>
    <tr>
      <td>Id</td>
      <td>Nome</td>
      <td>Email</td>
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

  const inserirInputSenha = createInputFromCallbacks(
    value => value.length < 8 ? 'Sua senha é muito curta' : '',
    value => (/(.)\1{3,}/).exec(value) ? 'Não use sequências como "1111" ou "dddd"' : '',
    value => (/[^#-&(-/\d?-zÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùç]/).exec(value) ? 'Essa senha contém caracteres além de letras, números ou #$%&?@()*+,-./)' : ''
  );
  inserirInputSenha.type = 'password';
  inserirInputSenha.classList.add('inserirInput');
  inserirInputSenha.placeholder = 'senha';
  inserirInputSenha.required = true;
  inserirInputSenha.maxLength = 200;
  inserirInputSenha.autocomplete = 'new-password';

  const inserirButtonRevelarSenha = document.createElement('input');
  inserirButtonRevelarSenha.type = 'button';
  inserirButtonRevelarSenha.value = 'Revelar senha';
  inserirButtonRevelarSenha.onclick = function () {
    if (inserirInputSenha.type === 'password') {
      this.value = 'Esconder Senha';
      inserirInputSenha.type = 'text';
    } else {
      this.value = 'Revelar Senha';
      inserirInputSenha.type = 'password';
    }
  };

  const inserirEnviar = document.createElement('input');
  inserirEnviar.type = 'button';
  inserirEnviar.id = 'inserirEnviar';
  inserirEnviar.value = 'Salvar no banco';
  inserirEnviar.onclick = async () => {
    if (inserir.reportValidity()) {
      const request = new FormData();
      request.append('requisicao', JSON.stringify({
        nome: inserirInputNome.value,
        email: inserirInputEmail.value,
        senha: inserirInputSenha.value
      }));
      request.append('tipo', 'usuario');
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

  inserir.append(inserirInputNome, inserirInputEmail, inserirInputSenha, inserirButtonRevelarSenha, inserirEnviar);

  const excluir = document.createElement('div');
  excluir.id = 'excluir';
  excluir.textContent = 'delete';
  excluir.ondragover = e => { e.preventDefault(); };
  excluir.ondrop = async (e) => {
    deleteData(e.dataTransfer.getData('id')).then(ev => {
      fetch('/backend/main.php?tipo=usuario&pedido=listar').then(r => r.json()).then(json => {
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
  request.append('tipo', 'usuario');
  request.append('pedido', 'deletar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const editData = (id, nome, email, senha) => {
  const request = new FormData();
  request.append('requisicao', JSON.stringify({ id: id, nome: nome, email: email, senha: senha }));
  request.append('tipo', 'usuario');
  request.append('pedido', 'atualizar');

  return fetch('backend/main.php', {
    method: 'post',
    body: request
  }).then(r => r.ok);
};

const regenTable = async (tbody) => {
  await fetch('/backend/main.php?tipo=usuario&pedido=listar').then(t => t.json()).then(listJson => {
    while (tbody.firstChild) { tbody.firstChild.remove(); }

    generateTableDatas(listJson.resposta)?.forEach(elem => tbody.appendChild(elem));
  });
};

const editModal = (id, nome, email) => {
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

  // tr da senha
  const divSenha = document.createElement('div');

  const senhaNome = document.createElement('div');
  senhaNome.innerText = 'Email';

  const senhaValor = createInputFromCallbacks(
    value => value.length < 8 ? 'Sua senha é muito curta' : '',
    value => (/(.)\1{3,}/).exec(value) ? 'Não use sequências como "1111" ou "dddd"' : '',
    value => (/[^#-&(-/\d?-zÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùç]/).exec(value) ? 'Essa senha contém caracteres além de letras, números ou #$%&?@()*+,-./)' : ''
  );
  senhaValor.type = 'password';
  senhaValor.placeholder = 'senha';
  senhaValor.required = true;
  senhaValor.maxLength = 200;
  senhaValor.autocomplete = 'current-password';

  const revelarSenha = document.createElement('input');
  revelarSenha.type = 'button';
  revelarSenha.value = 'Revelar senha';
  revelarSenha.onclick = function () {
    if (senhaValor.type === 'password') {
      this.value = 'Esconder Senha';
      senhaValor.type = 'text';
    } else {
      this.value = 'Revelar Senha';
      senhaValor.type = 'password';
    }
  };

  divSenha.append(senhaNome, senhaValor, revelarSenha);
  mainDiv.appendChild(divSenha);

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
        senhaValor.value
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

    tr.draggable = true;
    tr.ondragstart = (ev) => ev.dataTransfer.setData('id', e.id);

    tdId.textContent = e.id;
    tdNome.textContent = e.nome;
    tdEmail.textContent = e.email;

    tr.append(tdId, tdNome, tdEmail);

    tr.onclick = () => editModal(e.id, e.nome, e.email);

    return tr;
  });
};

export { start };
export default start;
