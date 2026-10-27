import { Router } from "express";
import PagamentoController from "../controller/pagamentoController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";


const PagamentoMock = Router()


PagamentoMock.patch('/pagamentos/:id/mock', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE'), AuthorizationMiddleware.autorizarClientePagamento(), PagamentoController.pagamento)

export default PagamentoMock