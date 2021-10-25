create database if not exists hamburgueria2021;

use hamburgueria2021;

create table if not exists hamburguer(
	idhamburguer int unsigned primary key not null auto_increment,
    nome varchar(30) not null,
    categoria varchar(30) not null, /*aqui deveria ser outra tabela*/
    preco float not null,
    desconto float, /* outra tabela, */
    descricao varchar(512)
);

#alter table hamburguer modify column idhamburguer int unsigned primary key not null auto_increment;

#insert into hamburguer(nome, categoria, preco, desconto, descricao) values('', '', '0.4', '0.2', '');