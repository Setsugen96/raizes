import { Router } from "express";
import CardapioController from "../controller/cardapioController.js";
import AuthMiddleware from "../middleware/authorizationMiddleware.js";

const CardapioRota = Router()

/**
 * @swagger
 * /cardapios:
 *   post:
 *     summary: Cadastra uma linha no cardápio
 *     description: Associa um produto a uma loja, podendo definir um período de disponibilidade.
 *     tags:
 *       - Cardápios
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
 *               - produto_id
 *             properties:
 *               loja_id:
 *                 type: integer
 *                 example: 1
 *               produto_id:
 *                 type: integer
 *                 example: 2
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 example: "01-01-2026"
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 example: "30-01-2026"
 *     responses:
 *       201:
 *         description: Cardápio cadastrado com sucesso
 *       400:
 *         description: Dados inválidos, loja ou produto inexistente, estados diferentes ou datas inválidas.
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão ou sem acesso à loja
 *       409:
 *         description: Esse produto já está cadastrado nessa loja
 *       500:
 *         description: Erro interno do servidor
 */
CardapioRota.post('/cardapios', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('GERENTE', 'ADMINISTRADOR'), AuthMiddleware.autorizarAcessoLoja(), 
CardapioController.store)

/**
 * @swagger
 * /cardapios/{id}:
 *   get:
 *     summary: Busca uma linha do cardápio
 *     description: Retorna uma linha do cardápio pelo seu ID, incluindo sua disponibilidade.
 *     tags:
 *       - Cardápios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da linha do cardápio.
 *     responses:
 *       200:
 *         description: Linha do cardápio encontrada com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Cardápio não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
CardapioRota.get('/cardapios/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('GERENTE', 'ADMINISTRADOR', 'CLIENTE', 'ATENDENTE'), 
CardapioController.show)

/**
 * @swagger
 * /cardapios:
 *   get:
 *     summary: Lista os cardápios
 *     description: Retorna as linhas de cardápio, podendo filtrar por loja e utilizar paginação.
 *     tags:
 *       - Cardápios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Número da página. Deve ser um inteiro maior ou igual a 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Quantidade de registros por página. Deve ser um inteiro maior ou igual a 1.
 *       - in: query
 *         name: loja_id
 *         schema:
 *           type: integer
 *         description: Filtra os cardápios pelo ID da loja.
 *     responses:
 *       200:
 *         description: Lista de cardápios retornada com sucesso
 *       400:
 *         description: Parâmetros de paginação inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       500:
 *         description: Erro interno do servidor
 */
CardapioRota.get('/cardapios', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('GERENTE', 'ADMINISTRADOR', 'CLIENTE', 'ATENDENTE'),
AuthMiddleware.autorizarAcessoCardapio(), CardapioController.index)

/**
 * @swagger
 * /cardapios/{id}:
 *   put:
 *     summary: Atualiza uma linha do cardápio
 *     description: Altera a loja, o produto ou o período de disponibilidade de uma linha do cardápio.
 *     tags:
 *       - Cardápios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da linha do cardápio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loja_id:
 *                 type: integer
 *                 example: 1
 *               produto_id:
 *                 type: integer
 *                 example: 2
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 example: "01-01-2026"
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 example: "30-01-2026"
 *     responses:
 *       200:
 *         description: Cardápio alterado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado para atualização
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão para gerenciar esse cardápio
 *       404:
 *         description: Cardápio não encontrado
 *       409:
 *         description: Esse produto já existe na loja
 *       500:
 *         description: Erro interno do servidor
 */
CardapioRota.put('/cardapios/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('GERENTE', 'ADMINISTRADOR'), 
AuthMiddleware.autorizarGerenciamentoCardapio(), CardapioController.update)

/**
 * @swagger
 * /cardapios/{id}:
 *   delete:
 *     summary: Exclui uma linha do cardápio
 *     description: Remove uma linha do cardápio pelo seu ID.
 *     tags:
 *       - Cardápios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da linha do cardápio.
 *     responses:
 *       200:
 *         description: Cardápio deletado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado.
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão para gerenciar esse cardápio
 *       404:
 *         description: Cardápio não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
CardapioRota.delete('/cardapios/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('GERENTE', 'ADMINISTRADOR'), 
AuthMiddleware.autorizarGerenciamentoCardapio(), CardapioController.delete)

export default CardapioRota
