import {Router} from 'express'
import FidelidadeController from '../controller/fidelidadeController.js';
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";

const FidelidadeRota = Router()



/**
 * @swagger
 * /fidelidade/{id}:
 *   put:
 *     summary: Atualiza o consentimento LGPD
 *     description: |
 *       Atualiza o status de consentimento LGPD do cliente.
 *       O ADMINISTRADOR pode atualizar qualquer cliente.
 *       O CLIENTE só pode atualizar o próprio registro.
 *       Quando consentimento_lgpd for true, a versão do termo
 *       deve ser informada. Quando for false, a versão e a
 *       data do consentimento serão definidas como null.
 *       A data do consentimento é gerada automaticamente pela API.
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consentimento_lgpd
 *             properties:
 *               consentimento_lgpd:
 *                 type: boolean
 *                 example: true
 *                 description: Informa se o cliente aceita os termos LGPD.
 *               versao_termo:
 *                 type: string
 *                 example: "1.0"
 *                 description: Versão atual do termo. Obrigatória quando consentimento_lgpd for true.
 *     responses:
 *       200:
 *         description: Consentimento atualizado com sucesso.
 *       400:
 *         description: Dados inválidos ou versão do termo incorreta.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Cliente tentou atualizar o registro de outro usuário.
 *       404:
 *         description: Registro de fidelidade não encontrado.
 *       409:
 *         description: Conflito ao atualizar o consentimento.
 *       500:
 *         description: Erro interno do servidor.
 */

FidelidadeRota.put('/fidelidade/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE'),  
AuthorizationMiddleware.autorizarFidelidade() ,FidelidadeController.update)

/**
 * @swagger
 * /fidelidade/{id}:
 *   get:
 *     summary: Consulta o status de consentimento LGPD
 *     description: |
 *       Retorna o registro de fidelidade e o status de consentimento LGPD
 *       do cliente informado.
 *       O ADMINISTRADOR pode consultar qualquer cliente.
 *       O CLIENTE só pode consultar o próprio registro.
 *     tags: [Fidelidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Status de consentimento encontrado com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Cliente tentou consultar o registro de outro usuário.
 *       404:
 *         description: Registro de fidelidade não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

FidelidadeRota.get('/fidelidade/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE'), 
AuthorizationMiddleware.autorizarFidelidade(), FidelidadeController.show)

export default FidelidadeRota