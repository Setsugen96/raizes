import {Router} from 'express'
import UsuarioController from '../controller/usuarioController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const UsuarioRota = Router()

//POST
UsuarioRota.post('/usuarios', UsuarioController.storeCliente)
UsuarioRota.post('/usuarios/funcionario', AuthMiddleware.autenticarToken , AuthorizationMiddleware.verificarRole('ADMINISTRADOR','GERENTE') , AuthorizationMiddleware.verificarCadastro(), UsuarioController.store)

//GETS
UsuarioRota.get('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR','GERENTE'), AuthorizationMiddleware.verificarLojaFuncionario(), UsuarioController.show)
UsuarioRota.get('/usuarios',AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR','GERENTE'),AuthorizationMiddleware.verificarLojaRole(),  UsuarioController.index)

//UPDATE
UsuarioRota.put('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), AuthorizationMiddleware.verificarUpdateUsuario(),  UsuarioController.update)

//DELETE
UsuarioRota.delete('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR', 'GERENTE'),AuthorizationMiddleware.verificarLojaFuncionario(), UsuarioController.delete)
export default UsuarioRota