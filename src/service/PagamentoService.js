import PagamentoModel from "../model/pagamentoModel.js";
import {ErroValidacao, ErroConflito, ErroNaoEncontrado, validarMetodoPagamento } from "./utils.js";



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

        if(!resultado || typeof resultado !== 'string') {
            throw new ErroValidacao("Processamento de pagamento inválido")
        }

        const resultadoFormatado = resultado.trim().toUpperCase()
        if(resultadoFormatado !== 'APROVADO' && resultadoFormatado !== 'RECUSADO') {
            throw new ErroValidacao("Processamento de pagamento inválido.")
        }

        if(pagamento.status_pagamento === 'APROVADO') {
            throw new ErroConflito("Pagamento já foi feito.")
        }

        if(pagamento.status_pagamento !== "PENDENTE" && pagamento.status_pagamento !== 'RECUSADO') {
            throw new ErroConflito("Pagamento não pode ser processado")
        }

        if(pagamento.status_pagamento === 'RECUSADO' && resultadoFormatado === 'RECUSADO') {
            throw new ErroConflito("O Pagamento já foi recusado.")
        }

        await PagamentoModel.update(pagamento.id, {status_pagamento: resultadoFormatado})

        if(resultadoFormatado === 'APROVADO') {
            return {
                message: "Pagamento Aprovado com Sucesso"
            }
        } else {
            return {
                message: "Pagamento Recusado"
            }
        }
    
    }

    async buscarPagamentoByPedidoId(id) {

        const pagamento = await PagamentoModel.findByPedidoId(id) 
        
        if(!pagamento) {
            throw new ErroNaoEncontrado("Pagamento não encontrado")
        }

        return pagamento

    }


}

export default new PagamentoService()