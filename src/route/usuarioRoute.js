import {Router} from 'express'
import UsuarioController from '../controller/usuarioController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const UsuarioRota = Router()

//POST
UsuarioRota.post('/usuarios/cliente', UsuarioController.storeCliente)
UsuarioRota.post('/usuarios/funcionario', AuthMiddleware.autenticarToken , AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE') , AuthorizationMiddleware.autorizarCadastroUsuario(), UsuarioController.store)

//GETS
UsuarioRota.get('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE'), AuthorizationMiddleware.autorizarAcessoFuncionario(), UsuarioController.show)
UsuarioRota.get('/usuarios',AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE'),AuthorizationMiddleware.autorizarConsultaUsuarios(),  UsuarioController.index)

//UPDATE
UsuarioRota.put('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), AuthorizationMiddleware.autorizarAtualizacaoUsuario(),  UsuarioController.update)

//DELETE
UsuarioRota.delete('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'),AuthorizationMiddleware.autorizarAcessoFuncionario(), UsuarioController.delete)
export default UsuarioRota