'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { createInputFromCallbacks } from '../util/input.js';
import $ from '../jquery.js';
import { ajax } from '../util/extra.js';

const start = async () => {
	$("#janela").html(`<table>
	<thead>
	<tr>
	<td>Id</td>
	<td>Nome</td>
	<td>Email</td>
	</tr>
	</thead>
	<tbody>
	</tbody>
	</table>`).append(
		$(document.createElement('form')).attr("id", 'inserir').append(
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
				value => value.length < 8 ? 'Sua senha é muito curta' : '',
				value => (/(.)\1{3,}/).exec(value) ? 'Não use sequências como "1111" ou "dddd"' : '',
				value => (/[^#-&(-/\d?-zÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùç]/).exec(value) ? 'Essa senha contém caracteres além de letras, números ou #$%&?@()*+,-./)' : ''
			)).attr({
				type: 'password',
				placeholder: 'senha',
				required: true,
				maxLength: 24,
				autocomplete: 'new-password',
			}),
			$(document.createElement('input')).attr({
				type: 'button',
				value: 'Revelar senha',
			}).click( function () {
				const input = $(this).parent().find('input[placeholder=\"senha\"]');

				if (input.attr('type') === 'password') {
					this.value = 'Esconder Senha';
					input.attr('type', 'text');
				} else {
					this.value = 'Revelar Senha';
					input.attr('type', 'password');
				}
			}),
			$(document.createElement('input')).attr({
				type: 'button',
				id: 'inserirEnviar',
				value: 'Salvar no banco'
			}).click( function () {
				if (this.parentElement.reportValidity()) {
					notif.idle('Enviando requisição', 'A requisição está sendo enviada');
				
				ajax.post(
					'backend/main.php/usuario',
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
						senha: $(this.parentElement).find('input[placeholder="senha"]').val()
					});
				} else { notif.error('Erro', 'Alguns campos não estão preenchidos corretamente'); }
			})
		)
	);

	regenTable();
	notif.stopIdle();
};

const deleteData = id => {
	ajax.delete('/backend/main.php/usuario/' + id);
};

const editData = (id, nome, email, senha) => {
	ajax.put('/backend/main.php/usuario/' + id, null, null, {
		id: id, nome: nome, email: email, senha: senha 
	});
};

const regenTable = () => {
	ajax.get('/backend/main.php/usuario', (status, text) => {
		const jqTBODY = $('tbody').empty();

		JSON.parse(text || "[]").forEach(e => jqTBODY.append(
			$(`<tr>
				<td>${e.id}</td>
				<td>${e.nome}</td>
				<td>${e.email}</td>
			</tr>
			`).click(() => editModal(e.id, e.nome, e.email)).get(0)
		));
	});
};

const editModal = (id, nome, email) => {
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
					$(document.createElement('div')).text('Senha'),
					$(createInputFromCallbacks(
						value => value.length < 8 ? 'Sua senha é muito curta' : '',
						value => (/(.)\1{3,}/).exec(value) ? 'Não use sequências como "1111" ou "dddd"' : '',
						value => (/[^#-&(-/\d?-zÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùç]/).exec(value) ? 'Essa senha contém caracteres além de letras, números ou #$%&?@()*+,-./)' : ''
					)).attr({
						type: 'password',
						placeholder: 'senha',
						required: true,
						maxLength: 24,
						autocomplete: 'current-password',
					}),
					$(document.createElement('input')).attr({
						type: 'button',
						value: 'Revelar senha',
					}).click( function () {
						const input = $(this).parent().find('input[placeholder=\"senha\"]');
		
						if (input.attr('type') === 'password') {
							this.value = 'Esconder Senha';
							input.attr('type', 'text');
						} else {
							this.value = 'Revelar Senha';
							input.attr('type', 'password');
						}
					})
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
								$(form).find('input[placeholder="senha"]').val()
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
