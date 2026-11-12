import LojaModel from "../model/lojaModel.js"

import {ErroValidacao, validarEntradaTexto,  validarValor, estadosDisponveis, ErroNaoEncontrado, validarId} from "./utils.js";

class LojaService {

    async cadastrar(loja) {
        //Valida e Formata o nome da Loja cadastrada
        loja.nome = validarEntradaTexto(loja.nome, "Nome da loja é obrigatório")
        // Verifica se o estado cadastrado na Loja existe
        loja.estado = validarValor(loja.estado, estadosDisponveis, "Estado inválido")
        return LojaModel.create(loja)
    }

    async buscarPorId(id) {

        //Valida Id e verifica se a loja procurada existe
        id = validarId(id)

        const loja = await LojaModel.findById(id)

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        return loja
    }

    async buscarFaturamento(id) {

        id = validarId(id)

        const loja = await LojaModel.findById(id)

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        const faturamento = await LojaModel.getfaturamento(id)

        return faturamento
    }

    async listar(page, limit, estado) {

        // Verifica se os valores page e limit enviados pelo params existem, são inteiros e maiores que 1
        if(page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            throw new ErroValidacao("Page inválido")
        }

         if(limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            throw new ErroValidacao("Limit inválido")
        }
        // Verifica se o estado enviado pelo params existe. A função de validação está em utils.js
        if(estado) {
            estado = validarValor(estado, estadosDisponveis, "Estado inválido")
        }
        
        return LojaModel.findAll(page, limit, estado)
    }

    async alterar(id, novosDados_loja) {
        //Valida id e verifica se a Loja alterada existe
        id = validarId(id)

        const loja = await LojaModel.findById(id)

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

         // Verifica se o usuário está enviando alguma coisa no body
        if (novosDados_loja.nome === undefined && novosDados_loja.estado === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        //Valida e formata o nome da loja atualizada
        if(novosDados_loja.nome !== undefined) {
            novosDados_loja.nome = validarEntradaTexto(novosDados_loja.nome, "Nome da loja é obrigatório")
        }

        //Valida se o estado atualizado é válido
        if(novosDados_loja.estado !== undefined) {
            novosDados_loja.estado = validarValor(novosDados_loja.estado, estadosDisponveis, "Estado inválido")
        }
   
        return LojaModel.update(id, novosDados_loja)
    }

    async deletar(id) {
        //Valida o id e verifica se a loja deletada existe
        id = validarId(id)

        const loja = await LojaModel.findById(id) 

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        return LojaModel.delete(id)
    }


}

export default new LojaService()