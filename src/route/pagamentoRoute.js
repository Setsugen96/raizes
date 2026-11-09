import { Router } from "express";
import PagamentoController from "../controller/pagamentoController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const PagamentoMock = Router()

/**
 * @swagger
 * /pagamentos/{id}/mock:
 *   patch:
 *     summary: Processar pagamento (simulação)
 *     description: Simula o processamento de um pagamento, permitindo aprovar ou recusar. Apenas o cliente proprietário do pedido pode realizar essa operação.
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do pagamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resultado
 *             properties:
 *               resultado:
 *                 type: string
 *                 enum: [APROVADO, RECUSADO]
 *                 example: APROVADO
 *     responses:
 *       200:
 *         description: Pagamento processado com sucesso.
 *       400:
 *         description: Resultado do processamento inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Cliente não possui permissão para processar este pagamento.
 *       404:
 *         description: Pagamento não encontrado.
 *       409:
 *         description: Pagamento não está pendente.
 *       500:
 *         description: Erro interno do servidor.
 */

PagamentoMock.patch('/pagamentos/:id/mock', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE'), AuthorizationMiddleware.autorizarClientePagamento(), PagamentoController.pagamento)

export default PagamentoMock