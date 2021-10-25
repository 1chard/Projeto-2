create database if not exists hamburgueria2021;

use hamburgueria2021;

create table if not exists hamburguer(
	idhamburguer int unsigned primary key not null auto_increment,
    nome varchar(30) not null,
    preco float not null,
    desconto float, /* outra tabela, */
    descricao varchar(512)
);

create table if not exists categoria(
	idcategoria int unsigned primary key not null auto_increment,
    nome varchar(30) not null
);

#alter table hamburguer modify column idhamburguer int unsigned primary key not null auto_increment;

#alter table hamburguer drop categoria;

#select * from hamburguer;

#insert into hamburguer(nome, categoria, preco, desconto, descricao) values('', '', '0.4', '0.2', '');
