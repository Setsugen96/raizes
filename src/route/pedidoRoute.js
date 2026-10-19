import { Router } from "express";
import PedidoController from "../controller/pedidoController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const PedidoRota = Router()


//POST 
PedidoRota.post('/pedidos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE'), PedidoController.store)

// GETS
PedidoRota.get('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMINISTRADOR'), 
AuthorizationMiddleware.autorizarAcessoPedido(), PedidoController.show)
PedidoRota.get('/pedidos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMINISTRADOR'), 
AuthorizationMiddleware.autorizarListagemPedidos(), PedidoController.index)
// UPDATE
PedidoRota.put('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'ATENDENTE', 'GERENTE'), 
AuthorizationMiddleware.autorizarAcessoPedido(), PedidoController.update)
// DELETE
PedidoRota.delete('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'), PedidoController.delete)

export default PedidoRota