import { Router } from "express";
import PagamentoController from "../controller/pagamentoController.js";
import AuthMiddleware from "../middleware/authorizationMiddleware.js";

const PagamentoRota = Router()

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

PagamentoRota.patch('/pagamentos/:id/mock', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('CLIENTE'), AuthMiddleware.autorizarClientePagamento(), PagamentoController.pagamento)

/**
 * @swagger
 * /pagamentos/{pedido_id}:
 *   get:
 *     summary: Busca pagamento pelo ID do pedido
 *     description: Retorna os dados do pagamento associado ao pedido informado. Apenas o cliente proprietário do pedido pode realizar essa consulta.
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedido_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do pedido associado ao pagamento.
 *     responses:
 *       200:
 *         description: Pagamento encontrado com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Cliente não possui permissão para consultar este pagamento.
 *       404:
 *         description: Pagamento não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */ 
PagamentoRota.get('/pagamentos/:pedido_id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('CLIENTE'), AuthMiddleware.autorizarBuscaPagamento(), PagamentoController.show)

export default PagamentoRota