select * from produto;
UPDATE produto SET nome='fdafdf42341', valor='2', desconto='2', destaque=1, idimagem=10, idcategoria=5 where idimagem=8;

create database if not exists hamburgueria2021;

use hamburgueria2021;

desc usuario;

create table if not exists categoria(
	idcategoria int unsigned primary key not null auto_increment unique,
    nome varchar(40) not null unique
);

create table if not exists contato(
	idcontato int unsigned primary key not null auto_increment unique,
    nome varchar(100) not null,
    email varchar(60) not null unique,
    celular varchar(11) not null
);

create table if not exists usuario(
	idusuario int unsigned primary key not null auto_increment unique,
    nome varchar(100) not null,
    email varchar(60) not null unique,
    senha varchar(32) not null
);

create table if not exists imagem(
	idimagem int unsigned primary key not null auto_increment unique,
    nome varchar(50) not null unique
);

create table if not exists produto(
	idproduto int unsigned primary key not null auto_increment unique,
    nome varchar(40) not null unique,
    valor float not null,
    destaque bool default false,
    desconto float default '0.0',
    idcategoria int unsigned not null,
    idimagem int unsigned not null,
    
    constraint fk_categoria_produto 
    foreign key (idcategoria)
    references categoria(idcategoria),
    constraint fk_imagem_produto
    foreign key (idimagem)
    references imagem(idimagem)
);