import {Router} from 'express'
import ProdutoController from '../controller/produtoController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const ProdutoRota = Router()

// POST 
ProdutoRota.post('/produtos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR'), ProdutoController.store)

// GETS 
ProdutoRota.get('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR', 'GERENTE'), ProdutoController.show)
ProdutoRota.get('/produtos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR', 'GERENTE'), ProdutoController.index)

//PUT
ProdutoRota.put('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR'), ProdutoController.update)

// DELETE
ProdutoRota.delete('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('ADMINISTRADOR'), ProdutoController.delete)

export default ProdutoRota