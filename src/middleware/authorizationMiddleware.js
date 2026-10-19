import CardapioModel from "../model/cardapioModel.js"
import LojaModel from "../model/lojaModel.js"
import PedidoModel from "../model/pedidoModel.js"
import UsuarioModel from "../model/usuarioModel.js"
import ErroValidacao, { validarRole } from "../service/untils.js"

class AuthorizationMiddleware {

    autorizarRoles(...rolesPermitidas) {


        return(req, res, next) => {

            if(!rolesPermitidas.includes(req.usuario.role)) {
                return res.status(403).json({
                    message: "Ação recusada pelo sistema."
                })
            }

            next()
        }

    }

    autorizarCadastroUsuario() {

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

    autorizarAcessoLoja() {

        return(req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }
            
            if(Number(req.usuario.loja_id) !== Number(req.body.loja_id)) {
                return res.status(403).json({
                    message: "Usuário só pode gerenciar dados da sua própria loja."
                })
            }

            next()
        }
    }

    autorizarAcessoFuncionario() {

        return async (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            const usuarioProcurado = await UsuarioModel.findById(req.params.id)
      
            if(usuarioProcurado && Number(usuarioProcurado.loja_id) !== Number(req.usuario.loja_id)) {
                return res.status(403).json({
                    message: "Usuário só pode gerenciar dados da sua própria Loja."
                })     
            }

            next()
        }
    }

    autorizarAtualizacaoUsuario() {

        return (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(Number(req.usuario.id) !== Number(req.params.id)) {
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

    autorizarConsultaUsuarios() {

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
            
                if(Number(req.usuario.loja_id) !== Number(req.query.loja_id)) {
                    return res.status(403).json({
                        message: "O Gerente só pode ver contas registradas na sua própria loja"
                    })
                }
            }

            next()

        }
    }

    autorizarGerenciamentoCardapio() {

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

            if(cardapio && Number(cardapio.loja_id) !== Number(req.usuario.loja_id)) {
                return res.status(403).json({
                    message: "Este usuário só pode gerenciar dados das suas próprias lojas."
                })
            }   
            
            next()
            
        }
    }


    autorizarAcessoPedido() {

        return async (req, res, next) =>{

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.usuario.role === 'CLIENTE') {

                const pedido = await PedidoModel.findById(req.params.id)

                if(pedido && Number(pedido.cliente_id) !== Number(req.usuario.id)) {
                    return res.status(403).json({
                        message: "Esse pedido não pertence a esse usuário."
                        })
                    }            
                }
            
            if(req.usuario.role === 'GERENTE' || req.usuario.role === 'ATENDENTE') {

                const pedido = await PedidoModel.findById(req.params.id)

                if(pedido && Number(pedido.loja_id) !== Number(req.usuario.loja_id)) {
                    return res.status(403).json({
                        message: "Funcionário só pode gerenciar pedidos da sua loja de atuação."
                        })
                    }
                }

            next()
        }
    }

    autorizarListagemPedidos() {

        return async (req, res, next) => {

            if(req.usuario.role === 'ADMINISTRADOR') {
                return next()
            }

            if(req.usuario.role === 'CLIENTE') {
                
                if('loja_id' in req.query || 'canal_pedido' in req.query || 'status_pedido' in req.query) {
                    return res.status(403).json({
                        message: "O Cliente só pode acessar pedidos."
                    })         
                }

                if(req.query.cliente_id === undefined) {
                    return res.status(403).json({
                        message: "É obrigatório que o cliente informe seu ID para fazer a busca dos pedidos."
                    }) 
                } 

                if(Number(req.query.cliente_id) !== Number(req.usuario.id)) {
                    return res.status(403).json({
                        message: "O Cliente só pode acessar seus próprios pedidos."
                    }) 
                }
            }

            if(req.usuario.role === 'GERENTE' || req.usuario.role === 'ATENDENTE') {

                if(Number(req.usuario.loja_id) !== Number(req.query.loja_id)) {
                    return res.status(403).json({
                        message: "Este usuário só pode gerenciar dados das suas próprias lojas."
                    }) 
                }
            }

            next()
        }
    }

}
   

export default new AuthorizationMiddleware()