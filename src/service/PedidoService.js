import LojaModel from "../model/lojaModel.js";
import PedidoModel from "../model/pedidoModel.js";
import ProdutoModel from "../model/produtoModel.js";
import UsuarioModel from "../model/usuarioModel.js";
import CardapioModel from "../model/cardapioModel.js";
import CardapioService from "./CardapioService.js";
import ErroValidacao, { validarCanal, validarEntradaTexto, validarStatus } from "./untils.js";
import connection from "../config/database.js";
import ItensPedidoModel from "../model/itensPedidoModel.js";



class PedidoService {

    async cadastrar(pedido) {

        if(!Array.isArray(pedido.itens) || pedido.itens.length === 0) {
            throw new ErroValidacao("O Pedido precisa ter pelo menos um produto")
        }

        const cliente = await UsuarioModel.findById(pedido.cliente_id)
        const loja = await LojaModel.findById(pedido.loja_id)

        if(!cliente) {
            throw new ErroValidacao("Cliente não encontrado")
        }

        if(!loja) {
            throw new ErroValidacao("Loja não encontrada")
        }

        pedido.canal_pedido = validarCanal(pedido.canal_pedido)

        const statusPedidoCliente = await PedidoModel.findPedidoStatus(pedido.cliente_id)

        if(statusPedidoCliente) {
            throw new ErroValidacao("Esse cliente já tem um pedido em andamento")
        }

        let precoTotal = 0
        for(const item of pedido.itens) {
            
            const produto = await ProdutoModel.findById(item.produto_id)
            if(!produto) {
                throw new ErroValidacao("Produto não foi encontrado")
            }

            const itemCardapio = await CardapioModel.findByLojaProduto(pedido.loja_id, item.produto_id)

            if(!itemCardapio) {
                throw new ErroValidacao("Produto não disponível no cardápio da loja")
            }

            const dataAtual = new Date()
            const verificarDataDisponibilidade = CardapioService.verificarDisponibilidadeProduto(itemCardapio.data_inicio, itemCardapio.data_fim, dataAtual)

            if(verificarDataDisponibilidade === "Indisponível") {
                throw new ErroValidacao("Esse produto não está disponível nessa época do Ano")
            }

            if(!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                throw new ErroValidacao("O produto deve conter pelo menos uma unidade")
            }

            const precoPorProduto = produto.preco * item.quantidade

            precoTotal += precoPorProduto

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
        
        return await PedidoModel.findById(id)
    }

    async listar(page, limit, cliente_id, loja_id, canal_pedido, status_pedido) {
        
        return await PedidoModel.findAll(page, limit, cliente_id, loja_id, canal_pedido, status_pedido)
        
    }

    async alterar(id, pedidoAtualizado) {

        const pedidoExistente = await PedidoModel.findById(id)

        if(!pedidoExistente) {
            return null 
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
        }

        return await PedidoModel.update(id, pedidoAtualizado)
     
    }

    async deletar(id) {
        
        return await PedidoModel.delete(id)
    }
}

export default new PedidoService()