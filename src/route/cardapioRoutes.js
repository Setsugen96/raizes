import { Router } from "express";
import CardapioController from "../controller/cardapioController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const CardapioRota = Router()

// POST  
CardapioRota.post('/cardapios', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('GERENTE', 'ADMINISTRADOR'), AuthorizationMiddleware.verificarLoja(), CardapioController.store)

// GETS
CardapioRota.get('/cardapios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('GERENTE', 'ADMINISTRADOR', 'CLIENTE', 'ATENDENTE'), CardapioController.show)
CardapioRota.get('/cardapios', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('GERENTE', 'ADMINISTRADOR', 'CLIENTE', 'ATENDENTE'),  CardapioController.index)

//UPDATE
CardapioRota.put('/cardapios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('GERENTE', 'ADMINISTRADOR'), AuthorizationMiddleware.verificarLojaCardapio(), CardapioController.update)

// DELETE
CardapioRota.delete('/cardapios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.verificarRole('GERENTE', 'ADMINISTRADOR'), AuthorizationMiddleware.verificarLojaCardapio(), CardapioController.delete)

export default CardapioRota
