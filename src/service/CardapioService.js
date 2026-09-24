import CardapioModel from "../model/cardapioModel.js"
import LojaModel from "../model/lojaModel.js"
import ProdutoModel from "../model/produtoModel.js"
import ErroValidacao, { formatarData, validarDatas, validarId } from "./untils.js"



class CardapioService {

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

        if(novo_cardapio.loja_id === undefined || novo_cardapio.produto_id === undefined) {
            throw new ErroValidacao("Loja e Produto são dados obrigatórios")
        }

        const loja = await LojaModel.findById(novo_cardapio.loja_id)
        const produto = await ProdutoModel.findById(novo_cardapio.produto_id)

        if(!loja || !produto) {
            throw new ErroValidacao("Loja e Produto inválido ou não encontrado.")
        }

        if(loja.estado !== produto.estado) {
            throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
        }
        
        if(novo_cardapio.data_inicio !== undefined && novo_cardapio.data_fim === undefined || novo_cardapio.data_inicio === undefined && novo_cardapio.data_fim !== undefined) {
            throw new ErroValidacao("Datas de inicio e fim devem ser informadas juntas")
        }

        if(novo_cardapio.data_inicio && novo_cardapio.data_fim) {
             const datas = validarDatas(novo_cardapio.data_inicio, novo_cardapio.data_fim)
             novo_cardapio.data_inicio = datas[0]
             novo_cardapio.data_fim = datas[1]
        }
       
        return await CardapioModel.create(novo_cardapio)
    }

    async buscarPorId(id) {
        
        const cardapio = await CardapioModel.findById(id)
        const dataAtual = new Date()

        if(!cardapio) {
            return null 
        }

        cardapio.disponibilidade = this.verificarDisponibilidadeProduto(cardapio.data_inicio, cardapio.data_fim, dataAtual)
        
        if(cardapio.data_inicio || cardapio.data_fim) {
            cardapio.data_inicio = formatarData(cardapio.data_inicio)
            cardapio.data_fim = formatarData(cardapio.data_fim)
        }
        
        return cardapio
        
    }

    async listar(page, limit, loja_id) {
        
        if(loja_id) {

            const cardapios = await CardapioModel.findAll(page, limit, loja_id)
            const dataAtual = new Date()

            for(const cardapio of cardapios) {

                cardapio.disponibilidade = this.verificarDisponibilidadeProduto(cardapio.data_inicio, cardapio.data_fim, dataAtual)

                if(cardapio.data_inicio || cardapio.data_fim) {
                    cardapio.data_inicio = formatarData(cardapio.data_inicio)
                    cardapio.data_fim = formatarData(cardapio.data_fim)
                }
                       
            }

            return cardapios      
         
        }

        return await CardapioModel.findAll(page, limit, loja_id)
       
    }

    async alterar(id, cardapio_atualizado) {

        const cardapio_existente = await CardapioModel.findById(id)
        
        if(!cardapio_existente) {
            return null 
        }

        if(
            cardapio_atualizado.loja_id === undefined &&
            cardapio_atualizado.produto_id === undefined &&
            cardapio_atualizado.data_inicio === undefined &&
            cardapio_atualizado.data_fim === undefined
        ) {   
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }
        
      
        if(cardapio_atualizado.loja_id !== undefined) {
            cardapio_atualizado.loja_id = validarId(cardapio_atualizado.loja_id)
            const loja = await LojaModel.findById(cardapio_atualizado.loja_id)

            if(!loja) {
                throw new ErroValidacao("Loja não foi encontrada.")
            }   
            
            // Busca e comparação de ESTADO com a linha já existente do cardápio
            
            const produto_cardapio = await ProdutoModel.findById(cardapio_existente.produto_id)

            if(loja.estado !== produto_cardapio.estado) {
                throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
            }
            
        }

        if(cardapio_atualizado.produto_id !== undefined) {
            cardapio_atualizado.produto_id = validarId(cardapio_atualizado.produto_id)
            const produto = await ProdutoModel.findById(cardapio_atualizado.produto_id)

            if(!produto) {
                throw new ErroValidacao("Produto não encontrado.")
            }  
            
            const loja_cardapio = await LojaModel.findById(cardapio_existente.loja_id)

            if(produto.estado !== loja_cardapio.estado) {
                throw new ErroValidacao("Estado do produto e da loja não podem ser diferentes.")
            }
        }

        if(cardapio_atualizado.data_inicio || cardapio_atualizado.data_fim) {
            const datas = validarDatas(cardapio_atualizado.data_inicio, cardapio_atualizado.data_fim)
            cardapio_atualizado.data_inicio = datas[0]
            cardapio_atualizado.data_fim = datas[1]
    
        }

        return await CardapioModel.update(id, cardapio_atualizado)
    }

    async deletar(id) {

        
        return await CardapioModel.delete(id)
    }

}

export default new CardapioService()