'use strict';

import Banner from './util/banner.js';
import { temaClaro, temaEscuro } from './util/tema.js';
import { createInputFromCallbacks } from './util/input.js';
import notif from './util/notification.js';


const banner = new Banner(document.getElementById('banner'));

banner.autoMove(8000);
banner.selectable();
banner.touchable();
banner.moveable();
banner.buttonLeft.classList.add('material-icons');
banner.buttonLeft.textContent = 'navigate_before';
banner.buttonRight.classList.add('material-icons');
banner.buttonRight.textContent = 'navigate_next';


if (window.matchMedia('screen and (prefers-color-scheme: dark)').matches) {
  temaEscuro();
  mudaTema.textContent = 'dark_mode';
} else {
  temaClaro();
  mudaTema.textContent = 'light_mode';
}

document.getElementById('mudaTema').onclick = function() {
  switch (mudaTema.textContent) {
    case 'dark_mode':
      temaClaro();
      this.textContent = 'light_mode';
      break;
    case 'light_mode':
      temaEscuro();
      this.textContent = 'dark_mode';
      break;
    default:
      throw new Error('n foi');
  }
};

const filtro = document.getElementById('filtro');

const contatosForm = document.getElementById('mequia');

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
  if (contatosForm.reportValidity()) {
    const request = new FormData();
    request.append('requisicao', JSON.stringify({
      nome: inserirInputNome.value,
      email: inserirInputEmail.value,
      celular: parseCelular(inserirInputCelular.value)
    }));
    request.append('tipo', 'contato');
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
        notif.message('Sucesso', 'Seu contato foi enviado! vc conseguiu');
      } else {
        notif.warning('Aviso', 'Esse email já foi cadastrado. Por favor: Insira outro email');
      }
    });
  } else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
};

contatosForm.append(inserirInputNome, inserirInputEmail, inserirInputCelular, inserirEnviar);

const parseCelular = val => {
  let celparse = '';
  val.match(/\d+/g).forEach(s => celparse += s);
  return celparse;
};
