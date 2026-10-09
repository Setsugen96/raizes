import CardapioModel from "../model/cardapioModel.js"
import LojaModel from "../model/lojaModel.js"
import UsuarioModel from "../model/usuarioModel.js"
import { validarRole } from "../service/untils.js"

class AuthorizationMiddleware {

    verificarRole(...rolesPermitidas) {


        return(req, res, next) => {

            if(!rolesPermitidas.includes(req.usuario.role)) {
                return res.status(403).json({
                    message: "Ação recusada pelo sistema."
                })
            }

            next()
        }

    }

    verificarCadastro() {

        return(req, res, next) =>{

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            const roleBody = validarRole(req.body.role)
            if(req.usuario.role === 'GERENTE' && roleBody === 'ATENDENTE') {
               if(req.usuario.loja_id !== req.body.loja_id) {
                    return res.status(403).json({
                        message: "O gerente pode apenas registrar funcionários da sua Loja de atuação."
                    })
               }
            }

            next()
        }
    }

    verificarLoja() {

        return(req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.usuario.loja_id !== req.body.loja_id) {
                return res.status(403).json({
                    message: "Usuário só pode gerenciar dados da sua própria loja."
                })
            }

            next()
        }
    }

    verificarLojaFuncionario() {

        return async (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            const usuarioProcurado = await UsuarioModel.findById(req.params.id)
            if(req.usuario.loja_id !== usuarioProcurado.loja_id) {
                return res.status(403).json({
                    message: "Usuário só pode gerenciar dados da sua própria Loja."
                })
            }

            next()
        }
    }

    verificarUpdateUsuario() {

        return (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.usuario.id !== Number(req.params.id)) {
                return res.status(403).json({
                    message: "O usuário só pode alterar dados da sua própria conta"
                })
            }

            if(req.body.role !== undefined || req.body.loja_id !== undefined) {
                return res.status(403).json({
                    message: "Apenas o administrador consegue alterar Role e vinculo com a Loja"
                })
            }

            next()
         
        }
    }

    verificarLojaRole() {

        return async(req, res, next) =>{

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.query.role) {
                return res.status(403).json({
                        message: "Erro na busca por Role, use a pesquisa por Loja ID"
                    })
            }
            if(req.query.loja_id) {
            
                if(req.usuario.loja_id != req.query.loja_id) {
                    return res.status(403).json({
                        message: "O Gerente só pode ver contas registradas na sua própria loja"
                    })
                }
            }

            next()

        }
    }

    verificarLojaCardapio() {

        return async (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.body && req.body.loja_id !== undefined) {
                return res.status(403).json({
                    message: "Gerentes não podem alterar a loja do cardápio"
                })
            }

            const cardapio = await CardapioModel.findById(req.params.id)

            if(cardapio && cardapio.loja_id !== req.usuario.loja_id) {
                return res.status(403).json({
                    message: "Usuário só pode gerenciar dados das suas próprias lojas."
                })
            }   
            
            next()
            
        }
    }
}
   

export default new AuthorizationMiddleware()