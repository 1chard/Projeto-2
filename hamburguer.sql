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

desc usuario;

-- alter table contato modify nome varchar(100) not null;

-- drop table if exists usuario;

create table if not exists categoria(
	idcategoria int unsigned primary key not null auto_increment,
    nome varchar(40) not null
);

create table if not exists contato(
	idcontato int unsigned primary key not null auto_increment,
    nome varchar(100) not null,
    email varchar(60) not null,
    celular varchar(11) not null
);

create table if not exists usuario(
	idusuario int unsigned primary key not null auto_increment,
    nome varchar(100) not null,
    email varchar(60) not null,
    senha varchar(32) not null
);

alter table usuario modify column senha varchar(32) not null;

select * from contato;
#INSERT into categoria(nome) values('$param->nome');

desc contato;
drop table contato;
alter table contato modify column celular varchar(11) not null;
#delete from contato where idcontato > 0;
#alter table hamburguer drop categoria;

#select * from hamburguer;

#insert into hamburguer(nome, categoria, preco, desconto, descricao) values('', '', '0.4', '0.2', '');
