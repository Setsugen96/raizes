import PagamentoModel from "../model/pagamentoModel.js";
import ErroValidacao, { ErroConflito, ErroNaoEncontrado, statusPagamentos, validarEntradaTexto, validarMetodoPagamento } from "./untils.js";



class PagamentoService {


    async cadastrar(pagamento, conexao) {

        pagamento.metodo_pagamento = validarMetodoPagamento(pagamento.metodo_pagamento)

        await PagamentoModel.create(pagamento, conexao)
    }

    async processarPagamento(id, resultado) {

        const pagamento = await PagamentoModel.findById(id)
        if(!pagamento) {
            throw new ErroNaoEncontrado("Pagamento não encontrado")
        }

        const resultadoFormatado = resultado.trim().toUpperCase()
        if(resultadoFormatado !== 'APROVADO' && resultadoFormatado !== 'RECUSADO') {
            throw new ErroValidacao("Processamento de pagamento inválido.")
        }

        if(pagamento.status_pagamento !== 'PENDENTE') {
            throw new ErroConflito("Pagamento não está pendente")
        }

        await PagamentoModel.update(pagamento.id, {status_pagamento: resultadoFormatado})
    
    }


}

export default new PagamentoService()