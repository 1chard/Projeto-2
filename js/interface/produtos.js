'use strict';

import notif from '../util/notification.js';
import modal from '../util/modal.js';
import { createInputFromCallbacks } from '../util/input.js';
import $ from '../jquery.js';
import { ajax } from '../util/extra.js';

const start = async () => {

	$('#janela').html(`<table>
    <thead>
        <tr>
            <td>Id</td>
            <td>Nome</td>
            <td>Valor</td>
            <td>Destaque</td>
            <td>Desconto</td>
            <td>Imagem</td>
            <td>Categoria</td>
        </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`).append(
		$(document.createElement('form')).attr('id', 'inserir').append(
			$(document.createElement('input')).attr({
				type: 'text',
				placeholder: 'nome',
				required: true,
				minLength: 3,
				maxLength: 100,
				autocomplete: 'username'
			}),
			$(document.createElement('input')).attr({
				type: 'number',
				placeholder: 'valor',
				required: true,
				step: 0.01
			}),
			$(document.createElement('input')).attr({
				type: 'checkbox',
				required: false,
				placeholder: 'destaque'
			}),
			$(document.createElement('input')).attr({
				type: 'number',
				placeholder: 'desconto',
				required: false,
				step: 0.01
			}),
			$(document.createElement('input')).attr({
				type: 'file',
				placeholder: 'imagem',
				required: true,
				accept: "image/*"
			}),
			$(document.createElement('select')).attr({
				type: 'number',
				required: true,
			}).append(
				function () {
					this.append(
						$(document.createElement("option")).attr({
							disabled: true,
							selected: true
						}).text("Selecione uma opção").get(0)
					);

					ajax.get("backend/main.php/categoria", (status, text) => {
						JSON.parse(text || '[]').forEach(
							e => $(this).append(
								$(document.createElement("option")).text(e.nome).val(e.id)
							)
						);

						
					});
				}
			), $(document.createElement('input')).attr({
				type: 'button',
				id: 'inserirEnviar',
				value: 'Salvar no banco'
			}).click(function () {
				if (form.reportValidity()) {
					const file = $(form).find('input[placeholder="imagem"]')[0].files[0];
					const filereader = new FileReader();

					filereader.onload = (event) => {

						notif.idle('Enviando requisição', 'A requisição está sendo enviada');
						ajax.post(
							'backend/main.php/hamburguer',
							(status, text) => {
								console.log(text)

								if (status === 200) {
									notif.message('Sucesso', 'Enviado com sucesso');
									regenTable();
								}
								else
									notif.warning('Aviso', 'Erro nas informações');
							},
							(status, text) => {

								console.log(text);
								notif.error('Erro', status)
							}
							, {
								nome: $(this.parentElement).find('input[placeholder="nome"]').val(),
								valor: $(this.parentElement).find('input[placeholder="valor"]').val(),
								destaque: $(this.parentElement).find('input[placeholder="destaque"]').prop("checked"),
								desconto: $(this.parentElement).find('input[placeholder="desconto"]').val(),
								categoria: $(this.parentElement).find('select').val(),
								imagem: {
									base64: filereader.result.substring(filereader.result.lastIndexOf(',')),
									nome: file.name,
									mimetype: file.type
								} ,
							});
					};

					filereader.readAsDataURL(file);
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
	ajax.delete('/backend/main.php/hamburguer/' + id);
};

const editData = (id, nome, valor, destaque, desconto, imagem, idcategoria) => {
	ajax.put('/backend/main.php/usuario/' + id, null, null, {
		id: id, nome: nome, valor: valor, destaque: destaque, desconto: desconto, imagem: imagem, categoria: idcategoria
	});
};

const regenTable = () => {
	ajax.get('/backend/main.php/hamburguer', (status, text) => {
		const jqTBODY = $('tbody').empty();

		JSON.parse(text || "[]").forEach(e => jqTBODY.append(
			$(`<tr>
				<td>${e.id}</td>
				<td>${e.nome}</td>
				<td>${e.valor}</td>
				<td>${e.destaque}</td>
				<td>${e.desconto}</td>
				<td><a target="_blank" href="../img/${e.imagem}">link</a></td>
				<td>${e.categoria}</td>
			</tr>
			`).click(() => editModal(e.id, e.nome, e.valor, e.destaque, e.desconto, e.imagem, e.categoria)).get(0)
		));
	});
};

const editModal = (id, nome, valor, destaque, desconto, imagem, categoria) => {
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
					$(document.createElement('div')).text('Valor'),
					$(document.createElement('input'))
						.attr({
							type: 'number',
							placeholder: 'valor',
							required: true,
							step: 0.01
						}).val(valor)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Destaque'),
					$(document.createElement('input'))
						.attr({
							type: 'checkbox',
							required: false,
							placeholder: 'destaque'
						}).prop("checked", destaque)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Desconto'),
					$(document.createElement('input'))
						.attr({
							type: 'number',
							placeholder: 'desconto',
							required: true,
							step: 0.01
						}).val(desconto)
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text('Imagem'),
					$(document.createElement('input')).attr({
						type: 'file',
						placeholder: 'imagem',
						required: false,
						accept: "image/*"
					})
				),
				$(document.createElement('div')).append(
					$(document.createElement('div')).text("Categoria"),
					$(document.createElement('select')).attr({
						type: 'number',
						required: true,
					}).append(
						function () {
							this.append(
								$(document.createElement("option")).attr({
									disabled: true,
									selected: true
								}).text("Selecione uma opção").get(0)
							);
		
							ajax.get("backend/main.php/categoria", (status, text) => {
								JSON.parse(text || '[]').forEach(
									e => $(this).append(
										$(document.createElement("option")).text(e.nome).val(e.id).attr("selected", categoria === e.nome)
									)
								);
		
								
							});
						}
					)
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
                                                    	const file = $(form).find('input[placeholder="imagem"]').get(0)?.files[0] ?? null;
							const filereader = new FileReader();
		
						
                                                        
							filereader.onload = (event) => {
								notif.idle('Enviando requisição', 'A requisição está sendo enviada');
								ajax.put(
									'backend/main.php/hamburguer',
									(status, text) => {
										console.log(text)
		
										if (status === 200) {
											notif.message('Sucesso', 'Enviado com sucesso');
											regenTable();
										}
										else
											notif.warning('Aviso', 'Erro nas informações');
									},
									(status, text) => {
		
										console.log(text);
										notif.error('Erro', status)
									}
									, {
										nome: $(form).find('input[placeholder="nome"]').val(),
										valor: $(form).find('input[placeholder="valor"]').val(),
										destaque: $(form).find('input[placeholder="destaque"]').prop("checked"),
										desconto: $(form).find('input[placeholder="desconto"]').val(),
										categoria: $(form).find('select').val(),
										imagem: file? {
											base64: filereader.result.substring(filereader.result.lastIndexOf(',')),
											nome: file.name,
											mimetype: file.type
										} : null
									});
							};
		
                                                        if(file !== null)
                                                            filereader.readAsDataURL(file);
                                                        else
                                                            filereader.onload()
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
