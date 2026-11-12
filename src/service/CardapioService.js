import CardapioModel from "../model/cardapioModel.js"
import LojaModel from "../model/lojaModel.js"
import ProdutoModel from "../model/produtoModel.js"
import {ErroValidacao, ErroNaoEncontrado, formatarData, validarDatas, validarId} from "./utils.js"



class CardapioService {

    // Verifica a disponibilidade e retorna um valor dependendo se a data registrada está dentro do periodo atual ou não
    verificarDisponibilidadeProduto(data_inicio, data_fim, data_atual = new Date()) {

        if(data_inicio === null || data_fim === null) {
            return "Disponível"
        }

        const inicio = new Date(data_inicio)
        const fim = new Date(data_fim)

        if(data_atual >= inicio && data_atual <= fim) {
            return "Disponível"
        }

        return "Indisponível"
    }

    async cadastrar(novo_cardapio) {

        // Verifica se foi enviado dados de Loja e Produto no body
        if(novo_cardapio.loja_id === undefined || novo_cardapio.produto_id === undefined) {
            throw new ErroValidacao("Loja e Produto são dados obrigatórios")
        }

        // Verifica se existem a loja e produto que tá sendo cadastrado no cardápio
        const loja = await LojaModel.findById(novo_cardapio.loja_id)
        const produto = await ProdutoModel.findById(novo_cardapio.produto_id)

        if(!loja || !produto) {
            throw new ErroValidacao("Loja e Produto inválido ou não encontrado.")
        }

        // Verifica se o atributo de estado da loja e do produto são iguais
        if(loja.estado !== produto.estado) {
            throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
        }
        
        //  Verifica se as duas datas estão sendo informadas. Para não permitir que seja enviado apenas uma das duas sozinha
        if(novo_cardapio.data_inicio !== undefined && novo_cardapio.data_fim === undefined || novo_cardapio.data_inicio === undefined && novo_cardapio.data_fim !== undefined) {
            throw new ErroValidacao("Datas de inicio e fim devem ser informadas juntas")
        }

        //Valida e formata as datas para o usuário conseguir enviar no formato DD/MM/YYYY
        if(novo_cardapio.data_inicio && novo_cardapio.data_fim) {
             const datas = validarDatas(novo_cardapio.data_inicio, novo_cardapio.data_fim)
             novo_cardapio.data_inicio = datas[0]
             novo_cardapio.data_fim = datas[1]
        }
       
        return CardapioModel.create(novo_cardapio)
    }

    async buscarPorId(id) {

        // Valida o Id e Verifica se há um cardápio registrado com o Id
        id = validarId(id)
        
        const cardapio = await CardapioModel.findById(id)
        // Salva a Data atual em uma variável
        const dataAtual = new Date()

        if(!cardapio) {
            throw new ErroNaoEncontrado("Cardápio não foi encontrado.")
        }
        //Verifica a disponibilidade do produto.
        cardapio.disponibilidade = this.verificarDisponibilidadeProduto(cardapio.data_inicio, cardapio.data_fim, dataAtual)
        
        // Se as datas existirem formata elas para o padrão dd/mm/yyyy para aparecer assim na resposta da requisição
        if(cardapio.data_inicio || cardapio.data_fim) {
            cardapio.data_inicio = formatarData(cardapio.data_inicio)
            cardapio.data_fim = formatarData(cardapio.data_fim)
        }
        
        return cardapio
        
    }

    async listar(page, limit, loja_id) {

        // Verifica se os valores page e limit enviados pelo params existem, são inteiros e maiores que 1
        if(page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            throw new ErroValidacao("Page inválido")
        }
        
        if(limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
            throw new ErroValidacao("Limit inválido")
        }
        
        if(loja_id) {

            const cardapios = await CardapioModel.findAll(page, limit, loja_id)
            const dataAtual = new Date()

            //Faz a verificação de disponibilidade de produto através das Datas e adiciona o atributo de disponibilidade pra cada um de acordo com o resultado
            for(const cardapio of cardapios) {

                cardapio.disponibilidade = this.verificarDisponibilidadeProduto(cardapio.data_inicio, cardapio.data_fim, dataAtual)

                // Se as datas existirem formata elas para o padrão dd/mm/yyyy para aparecer assim na resposta da requisição
                if(cardapio.data_inicio || cardapio.data_fim) {
                    cardapio.data_inicio = formatarData(cardapio.data_inicio)
                    cardapio.data_fim = formatarData(cardapio.data_fim)
                }                       
            }

            return cardapios             
        }

        return CardapioModel.findAll(page, limit, loja_id)     
    }

    async alterar(id, cardapio_atualizado) {

        //Validação do ID e verificação se o cardapio existe
        id = validarId(id)

        const cardapioExistente = await CardapioModel.findById(id)
        
        if(!cardapioExistente) {
            throw new ErroNaoEncontrado("Cardápio para atualizar não foi encontrado.")
        }

        // Verifica se o usuário está enviando alguma coisa no body
        if(
            cardapio_atualizado.loja_id === undefined &&
            cardapio_atualizado.produto_id === undefined &&
            cardapio_atualizado.data_inicio === undefined &&
            cardapio_atualizado.data_fim === undefined
        ) {   
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }
        
        // Validação caso o usuário tenta atualizar loja_id e produto_id ao mesmo tempo
        if(cardapio_atualizado.loja_id !== undefined && cardapio_atualizado.produto_id !== undefined) {

            // Validação do ID
            cardapio_atualizado.loja_id = validarId(cardapio_atualizado.loja_id)
            cardapio_atualizado.produto_id = validarId(cardapio_atualizado.produto_id)

            // Verifica se a loja e o produto para qual deseja atualizar existe
            const loja = await LojaModel.findById(cardapio_atualizado.loja_id)
            const produto = await ProdutoModel.findById(cardapio_atualizado.produto_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada.")
            }  

            if(!produto) {
                throw new ErroValidacao("Produto não encontrado.")
            }  

            //Verifica se o estado da loja atualizado e do produto atualizado são iguais
            if (loja.estado !== produto.estado) {
                throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
            }
            
        }
        
        // Validação caso o usuário tenta atualizar apenas a loja
        if(cardapio_atualizado.loja_id !== undefined && cardapio_atualizado.produto_id === undefined) {
            cardapio_atualizado.loja_id = validarId(cardapio_atualizado.loja_id)
            const loja = await LojaModel.findById(cardapio_atualizado.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada.")
            }   
            // Busca o produto usando o produto_id do cardapio existente encontrado
            const produtoCardapio = await ProdutoModel.findById(cardapioExistente.produto_id)
            //Verifica se o estado da loja para qual deseja atualizar é igual ao Estado do produto do cardapio procurado
            if(loja.estado !== produtoCardapio.estado) {
                throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
            }
            
        }

        // Validação caso o usuário tenta atualizar apenas o produto
        if(cardapio_atualizado.produto_id !== undefined && cardapio_atualizado.loja_id === undefined) {
            cardapio_atualizado.produto_id = validarId(cardapio_atualizado.produto_id)
            const produto = await ProdutoModel.findById(cardapio_atualizado.produto_id)

            if(!produto) {
                throw new ErroValidacao("Produto não encontrado.")
            }  
            // Busca a loja usando a loja_id do cardapio existente encontrado
            const lojaCardapio = await LojaModel.findById(cardapioExistente.loja_id)
            //Verifica se o estado do produto para qual deseja atualizar é igual ao estado da loja do cardapio procurado
            if(produto.estado !== lojaCardapio.estado) {
                throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
            }
        }

        //Valida e formata as datas para o usuário conseguir enviar no formato DD/MM/YYYY
        if(cardapio_atualizado.data_inicio || cardapio_atualizado.data_fim) {
            const datas = validarDatas(cardapio_atualizado.data_inicio, cardapio_atualizado.data_fim)
            cardapio_atualizado.data_inicio = datas[0]
            cardapio_atualizado.data_fim = datas[1]
    
        }
        
        return CardapioModel.update(id, cardapio_atualizado)
    }

    async deletar(id) {

        //Valida o id e verifica se a loja deletada existe
        id = validarId(id)

        const cardapio = await CardapioModel.findById(id)

        if(!cardapio) {
            throw new ErroNaoEncontrado("Cardápio para deletar não foi encontrado")
        }
        
        return CardapioModel.delete(id)
    }

}

export default new CardapioService()