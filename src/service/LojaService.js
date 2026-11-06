import LojaModel from "../model/lojaModel.js"

import ErroValidacao, {validarEntradaTexto, validarSet, estadosDisponveis, ErroNaoEncontrado, validarId} from "./utils.js";

class LojaService {

    async cadastrar(loja) {
        loja.nome = validarEntradaTexto(loja.nome, "Nome da loja é obrigatório")
        loja.estado = validarSet(loja.estado, estadosDisponveis, "Estado inválido")
        return LojaModel.create(loja)
    }

    async buscarPorId(id) {

        id = validarId(id)

        const loja = await LojaModel.findById(id)

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        return loja
    }

    async listar(page, limit, estado) {

        if(page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            throw new ErroValidacao("Page inválido")
        }

         if(limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            throw new ErroValidacao("Limit inválido")
        }

        if(estado) {
            estado = validarSet(estado, estadosDisponveis, "Estado inválido")
        }
        
        return LojaModel.findAll(page, limit, estado)
    }

    async alterar(id, novosDados_loja) {

        id = validarId(id)

        const loja = await LojaModel.findById(id)

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        if (novosDados_loja.nome === undefined && novosDados_loja.estado === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        if(novosDados_loja.nome !== undefined) {
            novosDados_loja.nome = validarEntradaTexto(novosDados_loja.nome, "Nome da loja é obrigatório")
        }

        if(novosDados_loja.estado !== undefined) {
            novosDados_loja.estado = validarSet(novosDados_loja.estado, estadosDisponveis, "Estado inválido")
        }
   
        return LojaModel.update(id, novosDados_loja)
    }

    async deletar(id) {

        id = validarId(id)

        const loja = await LojaModel.findById(id) 

        if(!loja) {

            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        return LojaModel.delete(id)
    }


}

export default new LojaService()