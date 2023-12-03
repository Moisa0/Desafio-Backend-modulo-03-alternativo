const { query } = require("../bancodedados/conexao")
const bcrypt = require('bcrypt')

const cadastrarProduto = async (req, res) =>{
    const {usuario} = req
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body

    if(!nome || !quantidade || !categoria || !preco || !descricao){
        return res.status(400).json({mensagem: 'Preencha os itens obrigatórios'})
    }
  
    try {
        
        const queryCadastro = 'insert into produtos (nome, quantidade, categoria, preco, descricao, imagem, usuario_id) values ($1, $2, $3, $4, $5, $6, $7) returning *'
        const paramCadastro = [nome, quantidade, categoria, preco, descricao, imagem, usuario.id]

        const produtoCadastrado = await query(queryCadastro, paramCadastro)

        if(produtoCadastrado.rowCount<=0){
            return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
        }

         
        return res.status(201).json(produtoCadastrado.rows[0])

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
    }
}

const listarProdutos = async (req,res)=>{
    const {usuario}=req

try {
    
    const produtos = await query('select * from produtos where usuario_id = $1',[usuario.id])

    return res.status(200).json(produtos.rows)


} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
}
}

const detalharProdutos = async (req,res)=>{
    const {usuario}=req
    const {id}= req.params

try {
    
    const produtos = await query('select * from produtos where usuario_id = $1 and id=$2',[usuario.id, id])

    if(produtos.rowCount<=0){
        return res.status(404).json({mensagem: 'O produto não foi encontrado'})
    }

    return res.status(200).json(produtos.rows[0])


} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
}
}

const editarProdutos = async (req,res)=>{
    const {usuario}=req
    const {id}=req.params
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body

    if(!nome || !quantidade || !categoria || !preco || !descricao){
        return res.status(400).json({mensagem: 'Preencha algum campo para atualizar'})
    }
  
    try {
        
        const produtos = await query('select * from produtos where usuario_id = $1 and id=$2',[usuario.id, id])

        if(produtos.rowCount<=0){
            return res.status(404).json({mensagem: 'O produto não foi encontrado'})
        }

        const queryCadastro = 'update produtos set nome=$1, quantidade=$2, categoria=$3, preco=$4, descricao=$5, imagem=$6, usuario_id=$7'
        const paramCadastro = [nome, quantidade, categoria, preco, descricao, imagem, usuario.id]

        const produtoCadastrado = await query(queryCadastro, paramCadastro)

        if(produtoCadastrado.rowCount<=0){
            return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
        }

         
        return res.status(201).json(produtoCadastrado.rows[0])


} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
}
}

const excluirProdutos = async (req,res)=>{
    const {usuario}=req
    const {id}= req.params


 try {
        
        const produtos = await query('select * from produtos where usuario_id = $1 and id=$2',[usuario.id, id])

        if(produtos.rowCount<=0){
            return res.status(404).json({mensagem: 'O produto não foi encontrado'})
        }

        const produtoExcluido = await query('delete from produtos where id=$1',[id])

        if(produtoExcluido.rowCount<=0){
            return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
        }

         
        return res.status(204).send()
} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
}
}


const filtrarProdutos = async (req,res)=>{
    const {usuario}=req
    const {categoria}= req.query


 try {
        
        const produtos = await query('select * from produtos where usuario_id = $1 and categoria=$2',[usuario.id, categoria])

        if(produtos.rowCount<=0){
            return res.status(404).json({mensagem: 'Não possuem produtos com esta categoria'})
        }
         
        return res.status(201).json(produtos.rows)
} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
}
}




module.exports = {
    cadastrarProduto,
    listarProdutos,
    detalharProdutos,
    editarProdutos,
    excluirProdutos,
    filtrarProdutos

}