const { query } = require('../bancodedados/conexao')
const jwt = require('jsonwebtoken')
const senhaDeControle = require('../bancodedados/senhaDeContole')

const filtroAutenticacao = async (req, res, next)=>{
    const {authorization} = req.headers

    if(!authorization){
        res.status(401).json({mensagem:'Você não está autorizado a executar esta função'})
    }

    try {
        const token = authorization.replace('Bearer', '').trim()

        const {id}= jwt.verify(token, senhaDeControle)

        const {rowCount, rows} = await query('select * from usuarios where id = $1', [id])

        if(rowCount<=0){
            return res.status(401).json({Mensagem:'Email ou senha estão incorretas'})
        }

        const usuario = rows[0]

        req.usuario = usuario

        next()

    } catch (error) {
        return res.status(500).json({mensagem:`Ocorreu um erro interno no servidor: ${error.message}`})
    }

}

module.exports = {
    filtroAutenticacao
}