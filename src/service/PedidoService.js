import LojaModel from "../model/lojaModel.js";
import PedidoModel from "../model/pedidoModel.js";
import ProdutoModel from "../model/produtoModel.js";
import UsuarioModel from "../model/usuarioModel.js";
import CardapioModel from "../model/cardapioModel.js";
import CardapioService from "./CardapioService.js";
import connection from "../config/database.js";
import ItensPedidoModel from "../model/itensPedidoModel.js";
import PagamentoService from "./PagamentoService.js";
import FidelidadeModel from "../model/fidelidadeModel.js";
import PagamentoModel from "../model/pagamentoModel.js";
import {ErroValidacao, ErroConflito, ErroNaoEncontrado, validarValor, validarId, canaisDisponiveis, statusDisponiveis } from "./utils.js";



class PedidoService {

    async cadastrar(pedido) {

        //Verifica se há itens para adicionar ao pedido
        if(!Array.isArray(pedido.itens) || pedido.itens.length === 0) {
            throw new ErroValidacao("O Pedido precisa ter pelo menos um produto")
        }

        //Verifica se o Cliente e a Loja que o pedido tá sendo feito existem
        const cliente = await UsuarioModel.findById(pedido.cliente_id)
        const loja = await LojaModel.findById(pedido.loja_id)

        if(!cliente) {
            throw new ErroNaoEncontrado("Cliente não encontrado")
        }

        if(!loja) {
            throw new ErroNaoEncontrado("Loja não encontrada")
        }

        //Verifica se o canal de compra que está sendo enviado é válido. Função validarValor em utils.js
        pedido.canal_pedido = validarValor(pedido.canal_pedido, canaisDisponiveis, "Canal Inválido")

        //Verifica se o Cliente tem algum pedido que não esteja como finalizado ou cancelado. Se for o caso ele retorna erro,
        //porque o cliente já teria algum pedido em andamento
        const clientePedido = await PedidoModel.findPedidoStatus(pedido.cliente_id)
        const pedidoAndamento = clientePedido.some(pedido_some => pedido_some.status_pedido !== "FINALIZADO" && pedido_some.status_pedido !== "CANCELADO")

        if(pedidoAndamento) {
            throw new ErroConflito("Cliente já possue um pedido em andamento")
        }

        //Variável responsável por acumular o valor total dos itens do pedido
        let precoTotal = 0
        for(const item of pedido.itens) {
            
            //Verifica se cada produto existe
            const produto = await ProdutoModel.findById(item.produto_id)
            if(!produto) {
                throw new ErroNaoEncontrado("Produto não foi encontrado")
            }

            //Verifica se aquele produto está disponível no cardápio da loja
            const itemCardapio = await CardapioModel.findByLojaProduto(pedido.loja_id, item.produto_id)

            if(!itemCardapio) {
                throw new ErroConflito("Produto não disponível no cardápio da loja")
            }

            //Verifica a disponibilidade atual do produto de acordo com a data
            const dataAtual = new Date()
            const verificarDataDisponibilidade = CardapioService.verificarDisponibilidadeProduto(itemCardapio.data_inicio, itemCardapio.data_fim, dataAtual)

            if(verificarDataDisponibilidade === "Indisponível") {
                throw new ErroConflito("Esse produto não está disponível nessa época do Ano")
            }

            //Valida o valor quantidade que tá sendo enviado e também verifica se há pelo menos 1 unidade do produto escolhido.
            if(!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
                throw new ErroValidacao("O produto deve conter pelo menos uma unidade")
            }

            // Calcula o valor do produto de acordo com sua quantidade e acumula na variável precoTotal a cada iteração
            const precoPorProduto = produto.preco * item.quantidade

            precoTotal += precoPorProduto

        }

        // Variável que armazena o ID do registro de fidelidade caso o cliente utilize os pontos
        let fidelidadeId = null

        // Verifica se o usuário deseja usar seus pontos de Fidelidade
        if(pedido.usar_pontos && pedido.usar_pontos === true) {

            // Busca a Fidelidade do usuário 
            const lgpd = await FidelidadeModel.findByClienteId(cliente.id)

            //Verifica se o consentimento está ativo
            if(lgpd.consentimento_lgpd === 1) {
                const pontos = lgpd.pontos
                precoTotal -= precoTotal *(pontos/100)
                fidelidadeId = lgpd.id

            } else {
                throw new ErroConflito("Seu consentimento LGPD não está autorizado")
            }

        }

        //Salva o preço total acumulado na variável de preço do pedido
        pedido.valor_total = precoTotal

        // Inicia uma conexão
        const conexao = await connection.getConnection()

        try {
            //Inicia uma transação
            await conexao.beginTransaction()
            // Cria um pedido
            const novoPedido = await PedidoModel.create(pedido, conexao)

            // Itera itens enviados no pedido
            for(const item of pedido.itens) {
                const produto = await ProdutoModel.findById(item.produto_id)
                // Cria um registro de item do pedido para cada produto enviado no body
                await ItensPedidoModel.create({
                    pedido_id: novoPedido.id,
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    preco_unidade: produto.preco
                }, conexao)
            }

            // Gera o pagamento com o valor total, método de pagamento e estabelece a conexão
            await PagamentoService.cadastrar({
                pedido_id: novoPedido.id,
                valor: precoTotal,
                metodo_pagamento: pedido.metodo_pagamento
            }, conexao)

           // Se fidelidadeId não for null é porque o usuário usou os pontos. Então atualiza os pontos pra 0
            if(fidelidadeId !== null) {
                await FidelidadeModel.updatePontos(fidelidadeId, 0, conexao)
            }

            // Commita a transação e retorna o pedido
            await conexao.commit()
            return novoPedido

            // Se acontecer algum erro dá rollback em todas requisições
        } catch (error) {
            await conexao.rollback()
            throw error 

            // Finaliza e libera a operação
        } finally {
            conexao.release()
        }

    }

    async buscarPorId(id) {

        // Valida o ID 
        id = validarId(id)

        //Verifica se o pedido pesquisado existe
        const pedido = await PedidoModel.findById(id)

        if(!pedido) {
            throw new ErroNaoEncontrado("Pedido não encontrado.")
        }
        
        return pedido
    }


    async listar(page, limit, cliente_id, loja_id, canal_pedido, status_pedido) {

        // Verifica se os valores page e limit enviados pelo params existem, são inteiros e maiores que 1
        if(page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            throw new ErroValidacao("Page inválido")
        }
        
        if(limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            throw new ErroValidacao("Limit inválido")
        }
        
        return PedidoModel.findAll(page, limit, cliente_id, loja_id, canal_pedido, status_pedido)
        
    }

    async alterar(id, pedidoAtualizado) {

        //Valida o ID
        id = validarId(id)

        //Verifica se o pedido existe
        const pedidoExistente = await PedidoModel.findById(id)

        if(!pedidoExistente) {
            throw new ErroNaoEncontrado("Pedido não encontrado.")
        }

        // Busca o pagamento vinculado ao pedido
        const pagamento = await PagamentoModel.findByPedidoId(id)

        //Verifica se o pagamento do pedido foi realizado e aprovado pelo sistema
        if(pagamento.status_pagamento !== "APROVADO") {
            throw new ErroConflito("O Pagamento desse pedido ainda não foi feito.")
        }
        // Verifica se está tentando alterar algo além do status e canal do pedido
        if(pedidoAtualizado.cliente_id || pedidoAtualizado.loja_id || pedidoAtualizado.valor_total || pedidoAtualizado.data_pedido) {
            throw new ErroValidacao("Esses dados não podem ser alterados")
        }

        //Verifica se algo está sendo enviado para alterações
        if(pedidoAtualizado.canal_pedido === undefined && pedidoAtualizado.status_pedido === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        //Valida o canal e status do pedido alterado. Função validarValor em utils.js
        if(pedidoAtualizado.canal_pedido !== undefined) {
            pedidoAtualizado.canal_pedido = validarValor(pedidoAtualizado.canal_pedido, canaisDisponiveis, "Canal Inválido")
        }
        if(pedidoAtualizado.status_pedido !== undefined) {
            pedidoAtualizado.status_pedido = validarValor(pedidoAtualizado.status_pedido, statusDisponiveis, "Status Inválido")

            // Verifica se o pedido já possue status de FINALIZADO e impede alterações de status
            if(pedidoExistente.status_pedido === "FINALIZADO") {
                throw new ErroConflito("Não é possível alterar o status de um pedido finalizado.")
            }
        }

        // Verifica se o pedido foi Finalizado
        if(pedidoAtualizado.status_pedido === 'FINALIZADO' && pedidoExistente.status_pedido !== 'FINALIZADO') {

            //Busca a fidelidade vinculada ao cliente que está fazendo o pedido
            const lgpd = await FidelidadeModel.findByClienteId(pedidoExistente.cliente_id)

            // Verifica se o consentimento LGPD está ativo. Se tiver calcula os novos pontos
            if(lgpd && lgpd.consentimento_lgpd === 1) {

                // Soma 10 pontos aos pontos existentes do cliente
                const pontosAtuais = lgpd.pontos
                const novosPontos = pontosAtuais + 10

                // Verifica se o cliente possue menos que 50 pontos acumulados(Que é o limite de pontos que se pode acumular)
                if(pontosAtuais < 50) {
                    await FidelidadeModel.updatePontos(lgpd.id, novosPontos)
                }
            }
        }

        return PedidoModel.update(id, pedidoAtualizado)
    }

    async deletar(id) {

        //Valida o ID
        id = validarId(id)

        // Verifica se o Pedido existe
        const pedido = await PedidoModel.findById(id)

        if(!pedido) {
            throw new ErroNaoEncontrado("Pedido não encontrado")
        }

        return PedidoModel.delete(id)
    }
}

export default new PedidoService()