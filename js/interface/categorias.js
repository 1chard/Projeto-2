'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { ajax } from '../util/extra.js';
import $ from '../jquery.js';

const start = async () => {
  notif.idle("Processando", "Aguarde o processamento...")

  const janela = document.getElementById('janela');

  $('#janela').html(`<table>
  <thead>
    <tr>
      <td>Id</td>
      <td>Nome</td>
    </tr>
  </thead>
  <tbody>
  </tbody>
  </table>`)
    .append(
      $(document.createElement('form'))
        .attr('id', "inserir")
        .append(
          $(document.createElement('input'))
            .attr(
              {
                type: "text",
                placeholder: 'nome',
                required: true,
                minLength: 3,
                maxLength: 100,
                autocomplete: 'username'
              }
            ).addClass('inserirInput')
        )
        .append(
          $(document.createElement('input'))
            .attr(
              {
                type: "button",
                id: 'inserirEnviar',
                value: 'Salvar no banco'
              }
            ).click(async function () {
              if (this.parentElement.reportValidity()) {
                notif.idle('Enviando requisição', 'A requisição está sendo enviada');

                await ajax.post('backend/main.php', {
                  info: { nome: $(this.parentElement).find('input[placeholder="nome"]').val() },
                  tipo: 'categoria',
                  pedido: 'inserir'
                }).then(response => {
                  notif.stopIdle();
                  if (response.ok) {
                    return response.json();
                  } else {
                    notif.error('Erro', response.status);
                  }
                })?.then(async json => {
                  if (json.ok) {
                    notif.message('Sucesso', 'Enviado com sucesso');
                    regenTable();
                  } else {
                    notif.warning('Aviso', 'Erro nas informações');
                  }
                });
              } else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
            })
        )
    )

  regenTable();
  notif.stopIdle();
};

const deleteData = id => {
  return ajax.post('backend/main.php', {
    info: { id: id },
    tipo: 'categoria',
    pedido: 'deletar'
  }).then(r => r.ok);
};

const editData = (id, nome) => {
  return ajax.post('backend/main.php', {
    info: { id: id, nome: nome },
    tipo: 'categoria',
    pedido: 'atualizar'
  }).then(r => r.ok);
};

const regenTable = () => {
  ajax.get('/backend/main.php', { tipo: 'categoria', pedido: 'listar' }).then(t => t.json()).then(listJson => {
    const jqTBODY = $('tbody').empty();

    generateTableDatas(listJson.resposta)?.forEach(elem => jqTBODY.append(elem));
  });
};

const editModal = (id, nome) => {
  modal.clear();

  modal.append(
    $(document.createElement('form')).append(
      $(document.createElement('div')).attr('id', 'mainDiv').append(
        $(document.createElement('div')).append(
          $(document.createElement('div')).text("ID"),
          $(document.createElement('div')).text(id)
        ),
        $(document.createElement('div')).append(
          $(document.createElement('div')).text("Nome"),
          $(document.createElement('input'))
            .attr(
              {
                type: "text",
                placeholder: 'nome',
                required: true,
                minLength: 3,
                maxLength: 100,
                autocomplete: 'username'
              }
            ).val(nome)
        ),
      ),
      $(document.createElement('div')).attr('id', 'sendDiv').append(

      )
    ).get()
  );


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
