import LojaModel from "../model/lojaModel.js";
import PedidoModel from "../model/pedidoModel.js";
import ProdutoModel from "../model/produtoModel.js";
import UsuarioModel from "../model/usuarioModel.js";
import CardapioModel from "../model/cardapioModel.js";
import CardapioService from "./CardapioService.js";
import ErroValidacao, { ErroConflito, ErroNaoEncontrado, validarCanal, validarConsentimento, validarEntradaTexto, validarStatus } from "./untils.js";
import connection from "../config/database.js";
import ItensPedidoModel from "../model/itensPedidoModel.js";
import PagamentoService from "./PagamentoService.js";
import FidelidadeModel from "../model/fidelidadeModel.js";



class PedidoService {

    async cadastrar(pedido) {

        if(!Array.isArray(pedido.itens) || pedido.itens.length === 0) {
            throw new ErroValidacao("O Pedido precisa ter pelo menos um produto")
        }

        const cliente = await UsuarioModel.findById(pedido.cliente_id)
        const loja = await LojaModel.findById(pedido.loja_id)

        if(!cliente) {
            throw new ErroNaoEncontrado("Cliente não encontrado")
        }

        if(!loja) {
            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        pedido.canal_pedido = validarCanal(pedido.canal_pedido)

        const statusPedidoCliente = await PedidoModel.findPedidoStatus(pedido.cliente_id)

        if(statusPedidoCliente) {
            throw new ErroConflito("Esse cliente já tem um pedido em andamento")
        }

        let precoTotal = 0
        for(const item of pedido.itens) {
            
            const produto = await ProdutoModel.findById(item.produto_id)
            if(!produto) {
                throw new ErroNaoEncontrado("Produto não foi encontrado")
            }

            const itemCardapio = await CardapioModel.findByLojaProduto(pedido.loja_id, item.produto_id)

            if(!itemCardapio) {
                throw new ErroConflito("Produto não disponível no cardápio da loja")
            }

            const dataAtual = new Date()
            const verificarDataDisponibilidade = CardapioService.verificarDisponibilidadeProduto(itemCardapio.data_inicio, itemCardapio.data_fim, dataAtual)

            if(verificarDataDisponibilidade === "Indisponível") {
                throw new ErroConflito("Esse produto não está disponível nessa época do Ano")
            }

            if(!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                throw new ErroValidacao("O produto deve conter pelo menos uma unidade")
            }
            const precoPorProduto = produto.preco * item.quantidade

            precoTotal += precoPorProduto

        }

        let fidelidadeId = null

        if(pedido.usar_pontos && pedido.usar_pontos === true) {

            const lgpd = await FidelidadeModel.findByClienteId(cliente.id)

            if(lgpd.consentimento_lgpd === 1) {
                const pontos = lgpd.pontos
                precoTotal -= precoTotal *(pontos/100)
                fidelidadeId = lgpd.id
            }

        }

        pedido.valor_total = precoTotal

        const conexao = await connection.getConnection()

        try {

            await conexao.beginTransaction()

            const novoPedido = await PedidoModel.create(pedido, conexao)

            for(const item of pedido.itens) {
                const produto = await ProdutoModel.findById(item.produto_id)

                await ItensPedidoModel.create({
                    pedido_id: novoPedido.id,
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    preco_unidade: produto.preco
                }, conexao)
            }

            await PagamentoService.cadastrar({
                pedido_id: novoPedido.id,
                valor: precoTotal,
                metodo_pagamento: pedido.metodo_pagamento
            }, conexao)

            if(fidelidadeId !== null) {
                await FidelidadeModel.updatePontos(fidelidadeId, 0, conexao)
            }

            await conexao.commit()
            return novoPedido

        } catch (error) {
            await conexao.rollback()
            throw error 

        } finally {
            conexao.release()
        }

    }

    async buscarPorId(id) {

        const pedido = await PedidoModel.findById(id)

        if(!pedido) {
            throw new ErroNaoEncontrado("Pedido não encontrado.")
        }
        
        return pedido
    }

    async listar(page, limit, cliente_id, loja_id, canal_pedido, status_pedido) {
        
        return PedidoModel.findAll(page, limit, cliente_id, loja_id, canal_pedido, status_pedido)
        
    }

    async alterar(id, pedidoAtualizado) {

        const pedidoExistente = await PedidoModel.findById(id)

        if(!pedidoExistente) {
            throw new ErroNaoEncontrado("Pedido não encontrado.")
        }

        if(pedidoAtualizado.cliente_id || pedidoAtualizado.loja_id || pedidoAtualizado.valor_total || pedidoAtualizado.data_pedido) {
            throw new ErroValidacao("Esses dados não podem ser alterados")
        }

        if(pedidoAtualizado.canal_pedido === undefined && pedidoAtualizado.status_pedido === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        if(pedidoAtualizado.canal_pedido !== undefined) {
            pedidoAtualizado.canal_pedido = validarCanal(pedidoAtualizado.canal_pedido)

        }

        if(pedidoAtualizado.status_pedido !== undefined) {
            pedidoAtualizado.status_pedido = validarStatus(pedidoAtualizado.status_pedido)

            if(pedidoExistente.status_pedido === "FINALIZADO") {
                throw new ErroConflito("Não é possível alterar o status de um pedido finalizado.")
            }
        }

        if(pedidoAtualizado.status_pedido === 'FINALIZADO' && pedidoExistente.status_pedido !== 'FINALIZADO') {

            const lgpd = await FidelidadeModel.findByClienteId(pedidoExistente.cliente_id)

            if(lgpd && lgpd.consentimento_lgpd === 1) {

                const pontosAtuais = lgpd.pontos
                const novosPontos = pontosAtuais + 10

                if(pontosAtuais < 50) {
                    await FidelidadeModel.updatePontos(lgpd.id, novosPontos)
                }
            }
        }

        return PedidoModel.update(id, pedidoAtualizado)
    }

    async deletar(id) {

        const pedido = await PedidoModel.findById(id)

        if(!pedido) {
            throw new ErroNaoEncontrado("Pedido não encontrado")
        }

        return PedidoModel.delete(id)
    }
}

export default new PedidoService()