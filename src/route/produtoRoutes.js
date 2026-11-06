import {Router} from 'express'
import ProdutoController from '../controller/produtoController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const ProdutoRota = Router()

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto
 *     description: Adiciona um produto ao sistema.
 *     tags:
 *       - Produtos
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
 *               - preco
 *               - estado
 *               - receita
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Baião de dois
 *               preco:
 *                 type: number
 *                 minimum: 0
 *                 example: 25.90
 *               estado:
 *                 type: string
 *                 example: sergipe
 *               receita:
 *                 type: string
 *                 example: Arroz, feijão-de-corda, queijo coalho e carne seca.
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       409:
 *         description: Já existe um produto com esse nome
 *       500:
 *         description: Erro interno do servidor
 */
ProdutoRota.post('/produtos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'), ProdutoController.store)

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     description: Retorna os dados de um produto específico.
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
ProdutoRota.get('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'), ProdutoController.show)
/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de produtos, permitindo filtrar por estado e utilizar paginação.
 *     tags:
 *       - Produtos
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
 *         description: Quantidade de produtos por página. Deve ser um inteiro maior ou igual a 1.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtra produtos pelo estado
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *       400:
 *         description: Parâmetros de paginação ou estado informado inválido Estado informado inválido
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       500:
 *         description: Erro interno do servidor
 */
ProdutoRota.get('/produtos', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'), ProdutoController.index)

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     description: Atualiza os dados de um produto existente.
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Baião de dois especial
 *               preco:
 *                 type: number
 *                 example: 29.90
 *               estado:
 *                 type: string
 *                 example: sergipe
 *               receita:
 *                 type: string
 *                 example: Arroz, feijão-de-corda, queijo coalho e carne seca.
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Já existe um produto com esse nome
 *       500:
 *         description: Erro interno do servidor
 */
ProdutoRota.put('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'), ProdutoController.update)

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     description: Remove um produto do sistema pelo seu ID.
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       400:
 *         description: Dados inválidos ou nenhum dado informado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
ProdutoRota.delete('/produtos/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR'), ProdutoController.delete)

export default ProdutoRota