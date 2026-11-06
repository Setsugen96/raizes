import {Router} from 'express'
import UsuarioController from '../controller/usuarioController.js'
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const UsuarioRota = Router()

/**
 * @swagger
 * /usuarios/cliente:
 *   post:
 *     summary: Cadastra um novo cliente
 *     description: Realiza o cadastro de um cliente e cria automaticamente seu registro no programa de fidelidade.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha123
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *       400:
 *         description: Dados informados inválidos
 *       409:
 *         description: Email já registrado
 *       500:
 *         description: Erro interno do servidor
 */
UsuarioRota.post('/usuarios/cliente', UsuarioController.storeCliente)

/**
 * @swagger
 * /usuarios/funcionario:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     description: Cadastra um funcionário no sistema. Gerentes e Atendentes devem ser associados a uma loja. Atendentes só podem ser cadastrados pelo Gerente da sua Loja de atuação ou por um Administrador geral.
 *     tags:
 *       - Usuários
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
 *               - email
 *               - senha
 *               - role
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Oliveira
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha123
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMINISTRADOR
 *                   - GERENTE
 *                   - ATENDENTE
 *                 example: ATENDENTE
 *               loja_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID da loja à qual o funcionário será associado. Obrigatório para Gerentes e Atendentes.
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos, loja inexistente ou loja já possui gerente
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão para cadastrar funcionários
 *       409:
 *         description: Email já registrado
 *       500:
 *         description: Erro interno do servidor
 */
UsuarioRota.post('/usuarios/funcionario', AuthMiddleware.autenticarToken , AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE') , AuthorizationMiddleware.autorizarCadastroUsuario(), UsuarioController.store)

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     description: |
 *       Retorna os dados de um usuário específico.
 *       O ADMINISTRADOR pode consultar qualquer usuário.
 *       O GERENTE só pode consultar usuários vinculados à própria loja.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado. O gerente só pode consultar usuários da própria loja.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

UsuarioRota.get('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE'), AuthorizationMiddleware.autorizarAcessoFuncionario(), UsuarioController.show)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista os usuários
 *     description: |
 *       Retorna uma lista de usuários com paginação e filtros.
 *       O ADMINISTRADOR pode consultar todos os usuários.
 *       O GERENTE não pode filtrar por role e só pode consultar
 *       usuários da própria loja ao informar loja_id.
 *     tags: [Usuários]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CLIENTE, ADMINISTRADOR, ATENDENTE, GERENTE]
 *           example: CLIENTE
 *         description: Filtra os usuários pela função.
 *       - in: query
 *         name: loja_id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filtra os usuários pelo ID da loja.
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       400:
 *         description: Parâmetros de consulta inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado para a consulta solicitada.
 *       500:
 *         description: Erro interno do servidor.
 */

UsuarioRota.get('/usuarios',AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR','GERENTE'),AuthorizationMiddleware.autorizarConsultaUsuarios(),  UsuarioController.index)


/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     description: |
 *       Atualiza os dados de um usuário existente.
 *       O ADMINISTRADOR pode atualizar qualquer usuário e alterar
 *       sua role e seu vínculo com a loja.
 *       GERENTE, CLIENTE e ATENDENTE só podem atualizar a própria
 *       conta e não podem alterar role nem loja_id. CLIENTE não possui loja_id.
 *       É necessário informar pelo menos um campo para atualização.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: NovaSenha123
 *               role:
 *                 type: string
 *                 enum: [CLIENTE, ADMINISTRADOR, ATENDENTE, GERENTE]
 *                 example: ATENDENTE
 *               loja_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos ou nenhum campo informado para atualização.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado para atualizar o usuário ou alterar role/loja_id.
 *       404:
 *         description: Usuário não encontrado.
 *       409:
 *         description: Email já registrado.
 *       500:
 *         description: Erro interno do servidor.
 */

UsuarioRota.put('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE', 'ATENDENTE', 'GERENTE'), AuthorizationMiddleware.autorizarAtualizacaoUsuario(),  UsuarioController.update)


/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     description: |
 *       Exclui um usuário pelo ID.
 *       O ADMINISTRADOR pode excluir qualquer usuário.
 *       O GERENTE só pode excluir usuários vinculados à própria loja.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso negado para excluir o usuário.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

UsuarioRota.delete('/usuarios/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'GERENTE'),AuthorizationMiddleware.autorizarAcessoFuncionario(), UsuarioController.delete)
export default UsuarioRota