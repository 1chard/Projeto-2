'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { createInputFromCallbacks } from '../util/input.js';
import { ajax, unparseCelular, parseCelular } from '../util/extra.js';
import $ from '../jquery.js';

const start = async () => {
	notif.idle('Processando', 'Aguarde o processamento...');
	
	$("#janela").html(`<table>
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
    </table>`).append(
		$(document.createElement('form'))
				.attr('id', 'inserir')
				.append(
					$(document.createElement('input')).attr({
						type : 'text',
						placeholder : 'nome',
						required : true,
						minLength : 3,
						maxLength : 100,
						autocomplete : 'username'
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
					}).click( function () {
						if (this.parentElement.reportValidity()) {
							notif.idle('Enviando requisição', 'A requisição está sendo enviada');
				
								ajax.post(
									'backend/main.php/contato',
									(status) => {
										if (status === 200) {
											notif.message('Sucesso', 'Enviado com sucesso');
											regenTable();
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
				)
	);

	regenTable();
	notif.stopIdle();
};

const deleteData = id => {
	ajax.delete('/backend/main.php/contato/' + id);
};

const editData = (id, nome, email, celular) => {
	ajax.put('/backend/main.php/contato/' + id, null, null, {
		id: id, nome: nome, email: email, celular: celular 
	});
};

const regenTable = () => {
	ajax.get('/backend/main.php/contato', (status, text) => {
		const jqTBODY = $('tbody').empty();

		JSON.parse(text || "[]").forEach(e => jqTBODY.append(
			$(`<tr>
				<td>${e.id}</td>
				<td>${e.nome}</td>
				<td>${e.email}</td>
				<td>${unparseCelular(e.celular)}</td>
			</tr>
			`).click(() => editModal(e.id, e.nome, e.email, e.celular)).get(0)
		));
	});
};

const editModal = (id, nome, email, celular) => {
	modal.clear();

	modal.append(
		$(document.createElement('form')).append(
			$(document.createElement('div')).attr('id', 'mainDiv').append(
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('ID'),
					$(document.createElement('div')).text(id)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Nome'),
					$(document.createElement('input'))
						.attr(
							{
								type: 'text',
								placeholder: 'nome',
								required: true,
								minLength: 3,
								maxLength: 100,
								autocomplete: 'username'
							}
						).val(nome)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Email'),
					$(document.createElement('input'))
						.attr(
							{
								type: 'email',
								placeholder: 'email',
								required: true,
								maxLength: 60,
								autocomplete: 'email',
							}
						).val(email)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Celular'),
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
				}).val(unparseCelular(celular)),
				)
			),
			$(document.createElement('div')).attr('id', 'sendDiv').append(
				$(document.createElement('input')).attr({
					type: 'button',
					value: 'edit'
				}).click(
					function() {
						const form = this.parentElement.parentElement;

						if (form.reportValidity()) {
							editData(
								id,
								$(form).find('input[placeholder="nome"]').val(),
								$(form).find('input[placeholder="email"]').val(),
								parseCelular($(form).find('input[placeholder="celular"]').val())
							);
							regenTable();
							modal.hide();
						} else {
							notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); 
						}
					}
				),
				$(document.createElement('input')).attr({
					type: 'button',
					value: 'delete'
				}).click(
					function(){
						deleteData(id);
						regenTable();
						modal.hide();
					}
				)
			)
		).get(0)
	);

	modal.show();
};

export { start };
