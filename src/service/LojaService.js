import LojaModel from "../model/lojaModel.js"

import ErroValidacao, {validarEstado, validarEntradaTexto} from "./untils.js";

class LojaService {

    async cadastrar(loja) {
        loja.nome = validarEntradaTexto(loja.nome, "Nome da loja é obrigatório")
        loja.estado = validarEstado(loja.estado)
        return await LojaModel.create(loja)
    }

    async buscarPorId(id) {

        return await LojaModel.findById(id)
    }

    async listar(page, limit, estado) {

        if(estado) {
            estado = validarEstado(estado)
        }
        
        return await LojaModel.findAll(page, limit, estado)
    }

    async alterar(id, novosDados_loja) {

        if (novosDados_loja.nome === undefined && novosDados_loja.estado === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        if(novosDados_loja.nome !== undefined) {
            novosDados_loja.nome = validarEntradaTexto(novosDados_loja.nome, "Nome da loja é obrigatório")
        }

        if(novosDados_loja.estado !== undefined) {
            novosDados_loja.estado = validarEstado(novosDados_loja.estado)
        }
   
        const result = await LojaModel.update(id, novosDados_loja)

        return result 
    }

    async deletar(id) {

        return await LojaModel.delete(id)
    }


}

export default new LojaService()