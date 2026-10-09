import UsuarioModel from "../model/usuarioModel.js";
import ErroValidacao from "./untils.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthService {

    gerarToken(usuario) {
        const payload = {
            id: usuario.id,
            role: usuario.role,
            loja_id: usuario.loja_id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h'})
        return token 
    }

    async verificarSenha(senha, hashSenha) {
        const password = await bcrypt.compare(senha, hashSenha)
        return password
    }

    async conectar(usuario) {
         
        if(usuario.email === undefined || usuario.senha === undefined) {
            throw new ErroValidacao("Email e senha são obrigatórios para realizar o Login.")
        }

        const usuarioEncontrado = await UsuarioModel.findByEmail(usuario.email)

        if(!usuarioEncontrado) {
            
            throw new ErroValidacao("Email ou senha incorretos")
        }

        const senhaValida = await this.verificarSenha(usuario.senha, usuarioEncontrado.senha)

        if(senhaValida) {

            return usuarioEncontrado

        } else {
            
            throw new ErroValidacao("Email ou senha incorretos")
        }
        
    }
}

export default new AuthService()