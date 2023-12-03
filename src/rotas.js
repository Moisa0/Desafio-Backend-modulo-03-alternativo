const express = require('express');
const { cadastrarUsuario, detalharUsuario, editarUsuario } = require('./controladores/usuario');
const { login } = require('./controladores/login');
const { filtroAutenticacao } = require('./middleware/autenticacao');
const { cadastrarProduto, listarProdutos, detalharProdutos, editarProdutos, excluirProdutos, filtrarProdutos } = require('./controladores/produtos');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login',login)

rotas.use(filtroAutenticacao)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', editarUsuario)
rotas.post('/produtos', cadastrarProduto)
rotas.get('/produtos', listarProdutos)
rotas.get('/produtos/:id', detalharProdutos)
rotas.put('/produtos/:id', editarProdutos)
rotas.delete('/produtos/:id', excluirProdutos)
rotas.get('/produto', filtrarProdutos)

module.exports= rotas