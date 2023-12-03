create database market_cubos;

CREATE TABLE usuarios (
    id serial PRIMARY KEY,
    nome text NOT NULL,
    nome_loja text NOT NULL,
    email text UNIQUE NOT NULL,
    senha text NOT NULL
);

CREATE TABLE produtos (
    id serial PRIMARY KEY,
    usuario_id integer not null,
 	nome text not null,
  	quantidade integer not null,
  	categoria text not null,
  	preco integer not null,
  	descricao text,
  	imagem text not null,
  	foreign key (usuario_id) references usuarios(id)
);
