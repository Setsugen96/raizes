import {Router} from 'express'
import LojaController from '../controller/lojaController.js'
import AuthMiddleware from "../middleware/authorizationMiddleware.js";

const LojaRota = Router()

/**
 * @swagger
 * /lojas:
 *   post:
 *     summary: Cadastra uma nova loja
 *     description: Cadastra uma loja no sistema.
 *     tags:
 *       - Lojas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - estado
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Restaurante Raízes
 *               estado:
 *                 type: string
 *                 example: sergipe
 *     responses:
 *       201:
 *         description: Loja cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       409:
 *         description: Já existe uma loja com esse nome
 *       500:
 *         description: Erro interno do servidor
 */
LojaRota.post('/lojas', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR'),  LojaController.store)

/**
 * @swagger
 * /lojas/{id}:
 *   get:
 *     summary: Busca uma loja pelo ID
 *     description: Retorna os dados de uma loja específica.
 *     tags:
 *       - Lojas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja encontrada com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Loja não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
LojaRota.get('/lojas/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), LojaController.show)

/**
 * @swagger
 * /lojas:
 *   get:
 *     summary: Lista todas as lojas
 *     description: Retorna uma lista de lojas, podendo filtrar por estado e utilizar paginação.
 *     tags:
 *       - Lojas
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
 *         description: Quantidade de lojas por página.Deve ser um inteiro maior ou igual a 1.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtra as lojas pelo estado
 *     responses:
 *       200:
 *         description: Lista de lojas retornada com sucesso
 *       400:
 *         description: Parâmetros de paginação ou estado informado inválido.
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       500:
 *         description: Erro interno do servidor
 */
LojaRota.get('/lojas', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), LojaController.index)

/**
 * @swagger
 * /lojas/{id}:
 *   put:
 *     summary: Atualiza uma loja
 *     description: Atualiza o nome e/ou o estado de uma loja existente.
 *     tags:
 *       - Lojas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Restaurante Raízes
 *               estado:
 *                 type: string
 *                 example: sergipe
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Loja não encontrada
 *       409:
 *         description: Já existe uma loja com esse nome
 *       500:
 *         description: Erro interno do servidor
 */
LojaRota.put('/lojas/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'),  LojaController.update)


/**
 * @swagger
 * /lojas/faturamento/{id}:
 *   get:
 *     summary: Consulta o faturamento de uma loja
 *     description: Retorna o faturamento total dos pedidos concluídos da loja informada. Administradores podem consultar qualquer loja, enquanto gerentes podem consultar somente o faturamento da loja à qual estão vinculados.
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: ID da loja.
 *     responses:
 *       200:
 *         description: Faturamento da loja encontrado com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão para consultar o faturamento desta loja.
 *       404:
 *         description: Loja não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
LojaRota.get('/lojas/faturamento/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'), AuthMiddleware.autorizarAcessoFaturamento(),
LojaController.calcularFaturamento)
/**
 * @swagger
 * /lojas/{id}:
 *   delete:
 *     summary: Exclui uma loja
 *     description: Remove uma loja do sistema pelo seu ID.
 *     tags:
 *       - Lojas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja excluída com sucesso
 *       400:
 *          description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Loja não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
LojaRota.delete('/lojas/:id', AuthMiddleware.autenticarToken, AuthMiddleware.autorizarRoles('ADMINISTRADOR'),  LojaController.delete)

export default LojaRota 