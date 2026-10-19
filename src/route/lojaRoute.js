import {Router} from 'express'
import LojaController from '../controller/lojaController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const LojaRota = Router()

// POST 
LojaRota.post('/lojas', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'),  LojaController.store)

// GETS 
LojaRota.get('/lojas/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), LojaController.show)
LojaRota.get('/lojas', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), LojaController.index)

//PUT
LojaRota.put('/lojas/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'),  LojaController.update)

// DELETE
LojaRota.delete('/lojas/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'),  LojaController.delete)

export default LojaRota 