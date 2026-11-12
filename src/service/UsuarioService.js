import FidelidadeModel from "../model/fidelidadeModel.js";
import LojaModel from "../model/lojaModel.js";
import UsuarioModel from "../model/usuarioModel.js";
import {ErroValidacao, validarId, validarEntradaTexto, validarValor, rolesDisponiveis, ErroNaoEncontrado, ErroConflito} from "./utils.js";
import bcrypt from 'bcrypt'

class UsuarioService {

    async hashSenha(senha) {
        const hash = await bcrypt.hash(senha, 10)
        return hash 
    }

    async cadastrar(usuario) {
        // Valida e formata as credenciais de cadastro enviado pelo body. 
        // Funções disponíveis em utils.js
        usuario.nome = validarEntradaTexto(usuario.nome, "Nome do Usuário é obrigatório")
        usuario.email = validarEntradaTexto(usuario.email, "Email é obrigatório")
        usuario.senha = validarEntradaTexto(usuario.senha, "Senha é obrigatório")
        usuario.senha = await this.hashSenha(usuario.senha)
        usuario.role = validarValor(usuario.role, rolesDisponiveis, "Role inválida" )
    
        // Verifica se já existe um Gerente vinculado a loja
        if(usuario.role === 'GERENTE') {

            const gerente = await UsuarioModel.findGerenteById(usuario.loja_id)

            if(gerente) {
                throw new ErroConflito("Essa loja já possui um gerente")
            }
        }

        // Verifica se em caso de tentativa de registro de GERENTE E ATENDENTE está sendo
        // informado o loja_id
        if(usuario.role === "GERENTE" || usuario.role === "ATENDENTE" ) {

             if(usuario.loja_id === undefined) {

                throw new ErroValidacao("Associar um Gerente ou Atendente a uma loja é obrigatório")
            }
            // Validação de ID para retornar erro em caso de número de ID negativo, vazio ou quando não for um número inteiro
            usuario.loja_id = validarId(usuario.loja_id)

            //Busca e verificação pra ver se a loja_id existe no banco
            const loja = await LojaModel.findById(usuario.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada")
            }
      
        } else {
            // Validação em caso de tentativa de vincular um Cliente ou Administrador a uma Loja.
            // Apenas Gerente e Atendente possui o atributo de loja_id
            if(usuario.loja_id) {
                throw new ErroValidacao("Apenas Gerentes e Atendentes podem ser associados a lojas.")
            }
        }
        const novo_usuario = await UsuarioModel.create(usuario)
        
        // Inicializa o registro de Fidelidade ao novo cliente(com valores padrão)
        if(novo_usuario.role === 'CLIENTE') {

            await FidelidadeModel.create({cliente_id: novo_usuario.id})
        }

        return novo_usuario
    }

    async buscarPorId(id) {

        // Validação do ID enviado pelo params 
        id = validarId(id)

        //Busca e verifica se o usuário procurado existe
        const usuario = await UsuarioModel.findById(id) 

        if(!usuario) { 
            throw new ErroNaoEncontrado("Usuário não encontrado")
        }

        return usuario
    }

    async listar(page, limit, role, loja_id) {

        // Verifica se os valores page e limit enviados pelo params existem, são inteiros e maiores que 1
        if(page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            throw new ErroValidacao("Page inválido")
        }
        
        if(limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            throw new ErroValidacao("Limit inválido")
        }

        return UsuarioModel.findAll(page, limit, role, loja_id)
    }

    async alterar(id, usuario_atualizado) {

        // Validação do ID enviado pelo params 
        id = validarId(id)

        // Busca e verifica se o usuário existe
        const usuario = await UsuarioModel.findById(id)

        if(!usuario) {
            throw new ErroNaoEncontrado("Usuário para alterar não encontrado.")
        }

        // Verifica se o usuário está enviando alguma coisa no body
        if(
            usuario_atualizado.nome === undefined &&
            usuario_atualizado.email === undefined &&
            usuario_atualizado.senha === undefined &&
            usuario_atualizado.role === undefined &&
            usuario_atualizado.loja_id === undefined
        ) {
            throw new ErroValidacao("Nenhum dado foi informado pra atualização de usuário.")
        }

        //Valida e formata os dados que estão sendo enviados
        if(usuario_atualizado.nome !== undefined) {
            usuario_atualizado.nome = validarEntradaTexto(usuario_atualizado.nome, "Nome inválido")
        }

        if(usuario_atualizado.email !== undefined) {
            usuario_atualizado.email = validarEntradaTexto(usuario_atualizado.email, "Email inválido")
        }

        if(usuario_atualizado.senha !== undefined) {
            usuario_atualizado.senha = validarEntradaTexto(usuario_atualizado.senha, "Senha inválida")
            // Gera hash da nova senha
            usuario_atualizado.senha = await this.hashSenha(usuario_atualizado.senha)
        }

        // Validação para verificar se a role enviada é válida
        if(usuario_atualizado.role !== undefined) {
            usuario_atualizado.role = validarValor(usuario_atualizado.role, rolesDisponiveis, "Role inválida" )
            // Se o usuário que tá sendo alterado for receber a nova role como GERENTE 
            // verifica antes se já existe um GERENTE naquela loja
            if(usuario_atualizado.role === 'GERENTE') {

                const gerente = await UsuarioModel.findGerenteById(usuario.loja_id)

                if(gerente) {
                    
                    throw new ErroValidacao("Essa loja já tem gerente ")
                }
            }      
        }

        if((usuario_atualizado.role ?? usuario.role) === 'CLIENTE' && usuario_atualizado.loja_id !== undefined) {
            throw new ErroValidacao("Cliente não pode ser vinculado a uma loja")
        }

        // Se tentar alterar o loja_id faz validação e verifica se a loja pra qual vai ser atualizada existe
        if(usuario_atualizado.loja_id !== undefined) {
            usuario_atualizado.loja_id = validarId(usuario_atualizado.loja_id)

            const loja = await LojaModel.findById(usuario_atualizado.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada")
            }
        }

        return UsuarioModel.update(id, usuario_atualizado)
    }

    async deletar(id) {

        //Valida o ID e verifica se o Usuario que tá tentando deletar existe
        id = validarId(id)
        
        const usuario = await UsuarioModel.findById(id)

        if(!usuario) {
            throw new ErroNaoEncontrado("Usuário para deletar não encontrado")
        }
        
        return UsuarioModel.delete(id)
    }
}

export default new UsuarioService()