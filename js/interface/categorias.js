'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { ajax } from '../util/extra.js';
import $ from '../jquery.js';

const start = async () => {
	notif.idle('Processando', 'Aguarde o processamento...');

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
				.attr('id', 'inserir')
				.append(
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
						)
				)
				.append(
					$(document.createElement('input'))
						.attr(
							{
								type: 'button',
								id: 'inserirEnviar',
								value: 'Salvar no banco'
							}
						).click(async function () {
							if (this.parentElement.reportValidity()) {
								notif.idle('Enviando requisição', 'A requisição está sendo enviada');

								ajax.post(
									'backend/main.php/categoria',
									(status, text) => {
										if (status === 200) {
											notif.message('Sucesso', 'Enviado com sucesso');
											regenTable();
										}
										else
											notif.warning('Aviso', 'Erro nas informações');
									},
									(status, text) => notif.error('Erro', status)
									, {
										nome: $(this.parentElement).find('input[placeholder="nome"]').val()
									});
							} else {
								notif.error('Erro', 'Alguns campos não estão preenchidos corretamente');
							}
						})
				)
		);

	regenTable();
	notif.stopIdle();
};

const deleteData = id => {
	ajax.delete('backend/main.php/categoria/' + id);
};

const editData = (id, nome) => {
	ajax.put('backend/main.php/categoria/' + id, null, null, {
		nome: nome
	});
};

const regenTable = () => {
	ajax.get('/backend/main.php/categoria', function (status, text) {
		const jqTBODY = $('tbody').empty();

		JSON.parse(text || "[]").forEach(e => jqTBODY.append(
			$(`<tr>
				<td>${e.id}</td>
				<td>${e.nome}</td>
			</tr>
			`).click(() => editModal(e.id, e.nome)).get(0)
		));
	});
};

const editModal = (id, nome) => {
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
				)
			),
			$(document.createElement('div')).attr('id', 'sendDiv').append(
				$(document.createElement('input')).attr({
					type: 'button',
					value: 'edit'
				}).click(
					function () {
						const form = this.parentElement.parentElement;
						if (form.reportValidity()) {
							editData(
								id,
								$(form).find('input[placeholder="nome"]').val()
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
					function () {
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