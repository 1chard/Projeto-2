create database if not exists hamburgueria2021;

use hamburgueria2021;

/*
create table if not exists hamburguer(
	idhamburguer int unsigned primary key not null auto_increment,
    nome varchar(30) not null,
    preco float not null,
    desconto float,
    descricao varchar(512)
);
*/

drop table if exists usuario;

create table if not exists categoria(
	idcategoria int unsigned primary key not null auto_increment,
    nome varchar(30) not null
);

create table if not exists contato(
	idcontato int unsigned primary key not null auto_increment,
    nome varchar(30) not null,
    email varchar(30) not null,
    celular long not null
);

#alter table hamburguer modify column idhamburguer int unsigned primary key not null auto_increment;

#alter table hamburguer drop categoria;

#select * from hamburguer;

#insert into hamburguer(nome, categoria, preco, desconto, descricao) values('', '', '0.4', '0.2', '');
