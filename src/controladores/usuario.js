const { query } = require("../bancodedados/conexao")
const bcrypt = require('bcrypt')

const cadastrarUsuario= async (req,res)=>{
    const {nome, email, senha, nome_loja} = req.body

    if(!nome||!email||!senha||!nome_loja){
        return res.status(400).json({mensagem: 'Preencha os itens obrigatórios'})
    }

    try {
        const usuario = await query('select * from  usuarios where email = $1',[email])

        if(usuario.rowCount>0){
            return res.status(400).json({Mensagem:'O e-mail informado já existe cadastro em nossa plataforma'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const queryCadastro = 'insert into usuarios(nome, email, senha, nome_loja) values ($1,$2,$3,$4) returning *'
        const paramCadastro = [nome, email, senhaCriptografada, nome_loja]
        const usuarioCadastrado = await query(queryCadastro, paramCadastro)

        const {senha: _,...cadastro} = usuarioCadastrado.rows[0]

        return res.status(201).json(cadastro)

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
    }

}

const detalharUsuario = async (req, res) =>{

    const {senha: _, ...dadosUsuario}= req.usuario

    return res.status(200).json(dadosUsuario)
}

const editarUsuario = async (req, res)=>{
    const {usuario} = req
    const {nome, email, senha, nome_loja} = req.body

    if(!nome||!email||!senha||!nome_loja){
        return res.status(400).json({mensagem: 'Preencha os itens obrigatórios'})
    } 

    try {
        const usuarioEncontrado = await query('select * from  usuarios where email = $1',[email])

        if(usuario.rowCount>0 && usuarioEncontrado.rows[0].id!==usuario.id){
            return res.status(400).json({Mensagem:'O e-mail informado já está sendo utilizado por outro usuário'})
        }
       
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        
        const queryEdicao = 'update usuarios set nome=$1, email=$2,nome_loja=$3, senha=$4 where id=$5'
        const paramEdicao = [nome, email,nome_loja, senhaCriptografada, usuario.id]
        const usuarioEditado = await query(queryEdicao, paramEdicao)
       
   
        if(usuarioEditado.rowCount<=0){
            return res.status(500).json({Mensagem:`Ocorreu um erro interno com o servidor: ${error.message}`})
        }
        

        
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({mensagem: `Erro interno: ${error.message}`})
    }




}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    editarUsuario
}