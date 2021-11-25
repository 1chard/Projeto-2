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

create table if not exists produto(
	idproduto int unsigned primary key not null auto_increment unique,
    nome varchar(40) not null,
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

create table if not exists imagem(
	idimagem int unsigned primary key not null auto_increment unique,
    nome varchar(50) not null unique,
);

-- alter table imagem modify column nome varchar(50) not null unique;


select * from produto;

desc produto;

select * from usuario;
select idusuario from usuario where email='afdsf@gmail.com' and senha='4f9db6eec1b382f6184603793dc3fc6';
#INSERT into categoria(nome) values('$param->nome');



desc contato;
drop table contato;
alter table contato modify column celular varchar(11) not null;
#delete from contato where idcontato > 0;
#alter table hamburguer drop categoria;

#select * from hamburguer;

#insert into hamburguer(nome, categoria, preco, desconto, descricao) values('', '', '0.4', '0.2', '');
