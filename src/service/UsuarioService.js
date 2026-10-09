import LojaModel from "../model/lojaModel.js";
import UsuarioModel from "../model/usuarioModel.js";
import ErroValidacao, {validarId, validarEntradaTexto, validarRole} from "./untils.js";
import bcrypt from 'bcrypt'

class UsuarioService {

    async hashSenha(senha) {
        const hash = await bcrypt.hash(senha, 10)
        return hash 
    }

    async cadastrar(usuario) {
        usuario.nome = validarEntradaTexto(usuario.nome, "Nome do Usuário é obrigatório")
        usuario.email = validarEntradaTexto(usuario.email, "Email é obrigatório")
        usuario.senha = validarEntradaTexto(usuario.senha, "Senha é obrigatório")
        usuario.senha = await this.hashSenha(usuario.senha)
        usuario.role = validarRole(usuario.role)
    

        if(usuario.role === 'GERENTE') {

            const gerente = await UsuarioModel.findGerenteById(usuario.loja_id)

            if(gerente) {
                throw new ErroValidacao("Essa loja já possui um gerente")
            }
        }
        if(usuario.role === "GERENTE" || usuario.role === "ATENDENTE" ) {

             if(usuario.loja_id === undefined) {

                throw new ErroValidacao("Associar um Gerente ou Atendente a uma loja é obrigatório")
            }

            usuario.loja_id = validarId(usuario.loja_id)

            const loja = await LojaModel.findById(usuario.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada")
            }
      
        } else {

            if(usuario.loja_id) {
                throw new ErroValidacao("Apenas Gerentes e Atendentes podem ser associados a lojas.")
            }
        }
        
        return await UsuarioModel.create(usuario)
    }

    async buscarPorId(id) {

        return await UsuarioModel.findById(id)
    }

    async listar(page, limit, role, loja_id) {

        return await UsuarioModel.findAll(page, limit, role, loja_id)
    }

    async alterar(id, usuario_atualizado) {

        const usuario = await UsuarioModel.findById(id)

        if(!usuario) {
            return null 
        }

        if(
            usuario_atualizado.nome === undefined &&
            usuario_atualizado.email === undefined &&
            usuario_atualizado.senha === undefined &&
            usuario_atualizado.role === undefined &&
            usuario_atualizado.loja_id === undefined
        ) {
            throw new ErroValidacao("Nenhum dado foi informado pra atualização de usuário.")
        }

        if(usuario_atualizado.nome !== undefined) {
            usuario_atualizado.nome = validarEntradaTexto(usuario_atualizado.nome, "Nome inválido")
        }

        if(usuario_atualizado.email !== undefined) {
            usuario_atualizado.email = validarEntradaTexto(usuario_atualizado.email, "Email inválido")
        }

        if(usuario_atualizado.senha !== undefined) {
            usuario_atualizado.senha = validarEntradaTexto(usuario_atualizado.senha, "Senha inválida")
            usuario_atualizado.senha = await this.hashSenha(usuario_atualizado.senha)
        }

        if(usuario_atualizado.role !== undefined) {
            usuario_atualizado.role = validarRole(usuario_atualizado.role)
        }

        if(usuario_atualizado.loja_id !== undefined) {
            usuario_atualizado.loja_id = validarId(usuario_atualizado.loja_id)

            const loja = await LojaModel.findById(usuario_atualizado.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada")
            }
        }

        if((usuario_atualizado.role ?? usuario.role) === 'CLIENTE' && usuario_atualizado.loja_id !== undefined) {
            throw new ErroValidacao("Cliente não pode ser vinculado a uma loja")
        }

       

        return await UsuarioModel.update(id, usuario_atualizado)
    }

    async deletar(id) {
        
        return await UsuarioModel.delete(id)
    }

}

export default new UsuarioService()