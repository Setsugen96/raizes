import { Router } from "express";
import PedidoController from "../controller/pedidoController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const PedidoRota = Router()



/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cadastrar um novo pedido
 *     description: Registra um pedido para o cliente autenticado. O cliente_id é obtido automaticamente pelo token JWT e o valor_total é calculado pela API.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loja_id
 *               - canal_pedido
 *               - metodo_pagamento
 *               - itens
 *             properties:
 *               loja_id:
 *                 type: integer
 *                 example: 1
 *               canal_pedido:
 *                 type: string
 *                 enum: [APP, TOTEM, BALCÃO, PICKUP, WEB]
 *                 example: APP
 *               metodo_pagamento:
 *                 type: string
 *                 enum: [PIX, CARTAO, DINHEIRO]
 *                 example: PIX
 *               usar_pontos:
 *                 type: boolean
 *                 example: false
 *               itens:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - produto_id
 *                     - quantidade
 *                   properties:
 *                     produto_id:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido registrado com sucesso.
 *       400:
 *         description: Dados inválidos ou campos obrigatórios não informados.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário não possui permissão para cadastrar pedidos.
 *       404:
 *         description: Cliente, loja ou produto não encontrado.
 *       409:
 *         description: Cliente já possui pedido em andamento ou produto indisponível no cardápio.
 *       500:
 *         description: Erro interno do servidor.
 */

PedidoRota.post('/pedidos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE'), PedidoController.store)


/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Busca os dados de um pedido. Administradores podem consultar qualquer pedido, clientes apenas seus próprios pedidos e funcionários apenas pedidos da sua loja.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso.
 *       400:
 *         description: Id do pedido inválido
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário não possui permissão para acessar este pedido.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

PedidoRota.get('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMINISTRADOR'), 
AuthorizationMiddleware.autorizarAcessoPedido(), PedidoController.show)


/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     description: Lista os pedidos com paginação e filtros. Administradores podem consultar todos os pedidos. Clientes devem informar seu próprio cliente_id e não podem utilizar os filtros loja_id, canal_pedido e status_pedido. Gerentes e atendentes devem informar o loja_id da sua própria unidade.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Número da página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Quantidade de registros por página.
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filtrar pedidos pelo ID do cliente.
 *       - in: query
 *         name: loja_id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filtrar pedidos pelo ID da loja.
 *       - in: query
 *         name: canal_pedido
 *         schema:
 *           type: string
 *           enum: [APP, TOTEM, BALCÃO, PICKUP, WEB]
 *         description: Filtrar pedidos pelo canal de realização.
 *       - in: query
 *         name: status_pedido
 *         schema:
 *           type: string
 *           enum: [PENDENTE, EM PREPARO, EM ROTA DE ENTREGA, CANCELADO, FINALIZADO]
 *         description: Filtrar pedidos pelo status.
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *       400:
 *         description: Parâmetros de paginação inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário não possui permissão para consultar esses pedidos.
 *       500:
 *         description: Erro interno do servidor.
 */

PedidoRota.get('/pedidos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('CLIENTE', 'ATENDENTE', 'GERENTE', 'ADMINISTRADOR'), 
AuthorizationMiddleware.autorizarListagemPedidos(), PedidoController.index)


/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza o canal ou o status de um pedido. Administradores podem atualizar qualquer pedido, enquanto gerentes e atendentes podem atualizar apenas pedidos da própria loja. Não é possível alterar pedidos finalizados.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               canal_pedido:
 *                 type: string
 *                 enum: [APP, TOTEM, BALCÃO, PICKUP, WEB]
 *                 example: APP
 *               status_pedido:
 *                 type: string
 *                 enum: [PENDENTE, EM PREPARO, EM ROTA DE ENTREGA, CANCELADO, FINALIZADO]
 *                 example: EM PREPARO
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso.
 *       400:
 *         description: ID inválido ou dados informados para atualização inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário não possui permissão para atualizar este pedido.
 *       404:
 *         description: Pedido não encontrado.
 *       409:
 *         description: Não é possível alterar o status de um pedido finalizado.
 *       500:
 *         description: Erro interno do servidor.
 */

PedidoRota.put('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'ATENDENTE', 'GERENTE'), 
AuthorizationMiddleware.autorizarAcessoPedido(), PedidoController.update)

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Excluir pedido
 *     description: Exclui um pedido. Apenas usuários com a role ADMINISTRADOR podem realizar essa operação.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso.
 *       400:
 *         description: ID do pedido inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário não possui permissão para excluir pedidos.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

PedidoRota.delete('/pedidos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'), PedidoController.delete)

export default PedidoRota