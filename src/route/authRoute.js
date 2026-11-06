import { Router } from "express";
import AuthController from "../controller/authController.js"

const AuthRota = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario conectado
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João
 *                     role:
 *                       type: string
 *                       example: ADMINISTRADOR
 *                 token:
 *                   type: string
 *                   example: seu_token_jwt
 *       400:
 *         description: Dados inválidos ou credenciais incorretas
 *       500:
 *         description: Erro interno do servidor
 */
AuthRota.post('/auth/login', AuthController.login)


export default AuthRota
