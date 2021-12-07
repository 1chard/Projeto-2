'use strict';

import Banner from './util/banner.js';
import { temaClaro, temaEscuro } from './util/tema.js';
import { createInputFromCallbacks } from './util/input.js';
import notif from './util/notification.js';
import $ from './jquery.js'
import { parseCelular, ajax } from './util/extra.js'

const banner = new Banner(document.getElementById('banner'));

if (window.matchMedia('screen and (prefers-color-scheme: dark)').matches) {
	temaEscuro();
	mudaTema.textContent = 'dark_mode';
} else {
	temaClaro();
	mudaTema.textContent = 'light_mode';
}

document.getElementById('mudaTema').onclick = function () {
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


$(document.getElementById('mequia'))
	.attr('id', 'inserir')
	.append(
		$(document.createElement('input')).attr({
			type: 'text',
			placeholder: 'nome',
			required: true,
			minLength: 3,
			maxLength: 100,
			autocomplete: 'username'
		}),
		$(document.createElement('input')).attr({
			type: 'email',
			placeholder: 'email',
			required: true,
			maxLength: 60,
			autocomplete: 'email',
		}),
		$(createInputFromCallbacks(
			value => (/[^\d()\-\s]/g).test(value) ? 'Um número não pode conter letras ou caracteres além de ( ) -' : '',
			value => value.length < 10 ? 'Insira um número com dez ou onze dígitos' : '',
			value => !(/^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/).test(value) ? 'Esse número não é válido' : ''
		)).attr({
			type: 'tel',
			placeholder: 'celular',
			required: true,
			maxLength: 20,
			autocomplete: 'tel',
		}),
		$(document.createElement('input')).attr({
			type: 'button',
			id: 'inserirEnviar',
			value: 'Salvar no banco'
		}).click(function () {
			if (this.parentElement.reportValidity()) {
				notif.idle('Enviando requisição', 'A requisição está sendo enviada');

				ajax.post(
					'backend/main.php/contato',
					(status) => {
						if (status === 200) {
							notif.message('Sucesso', 'Enviado com sucesso');
						}
						else
							notif.warning('Aviso', 'Erro nas informações');
					},
					(status) => notif.error('Erro', status)
					, {
						nome: $(this.parentElement).find('input[placeholder="nome"]').val(),
						email: $(this.parentElement).find('input[placeholder="email"]').val(),
						celular: parseCelular($(this.parentElement).find('input[placeholder="celular"]').val())
					});
			} else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
		})
	);