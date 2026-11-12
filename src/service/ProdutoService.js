import ProdutoModel from "../model/produtoModel.js";
import {ErroValidacao, validarEntradaTexto, estadosDisponveis, validarValor, ErroNaoEncontrado, validarId} from "./utils.js";

class ProdutoService {

    //Valida o preço do produto
    validarPrecoProduto(novo_preco) {
         // Verifica se o preço não existe, se é null ou vazio
        if(novo_preco === undefined || novo_preco === null || novo_preco === '') {
            throw new ErroValidacao("O preço do produto é obrigatório.")
        }

        // Verifica se o preço informado é um número positivo
        const preco = Number(novo_preco) 

        if(isNaN(preco)) {
            throw new ErroValidacao("O preço precisa ser um número.")
        }

        if(preco < 0) {
            throw new ErroValidacao("O valor do produto não pode ser negativo.")
        }

        return preco 
    }

    async cadastrar(produto) {
            // Valida e formata as credenciais de cadastro de produto enviado pelo body. 
            // Funções disponíveis em utils.js
            produto.nome = validarEntradaTexto(produto.nome, "Nome do produto é obrigatório")
            produto.preco = this.validarPrecoProduto(produto.preco)
            produto.estado = validarValor(produto.estado, estadosDisponveis, "Estado inválido")
            produto.receita = validarEntradaTexto(produto.receita, "Descrição da receita é obrigatório")
            return ProdutoModel.create(produto)
    }

    async buscarPorId(id) {

        //Valida id
        id = validarId(id)

        //Verifica se o produto procurado existe
        const produto = await ProdutoModel.findById(id) 

        if(!produto) {
            throw new ErroNaoEncontrado("Produto não encontrado")
        }

        return produto
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
        
        return ProdutoModel.findAll(page, limit, estado )
    }

    async alterar(id, novosDados_produto) {

        // Valida Id e verifica se o produto alterado existe
        id = validarId(id)

        const produto = await ProdutoModel.findById(id) 

        if(!produto) {
            throw new ErroNaoEncontrado("Produto para alterar não encontrado")
        }

        // Verifica se o usuário está enviando alguma coisa no body
        if (novosDados_produto.nome === undefined && novosDados_produto.preco === undefined && novosDados_produto.estado === undefined && novosDados_produto.receita === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }
        // Se tentar alterar o nome do Produto valida e formata o novo nome
        if(novosDados_produto.nome !== undefined) {
            novosDados_produto.nome = validarEntradaTexto(novosDados_produto.nome, "Nome do produto é obrigatório")
        }
        
        //Valida o Preço do produto que tá sendo alterado
        if(novosDados_produto.preco !== undefined) {
            novosDados_produto.preco = this.validarPrecoProduto(novosDados_produto.preco)
        }
        //Valida se o estado atualizado é válido
        if(novosDados_produto.estado !== undefined) {
            novosDados_produto.estado = validarValor(novosDados_produto.estado, estadosDisponveis, "Estado inválido")
        }
        // Valida e formata a nova receita do Produto
        if(novosDados_produto.receita !== undefined) {
            novosDados_produto.receita = validarEntradaTexto(novosDados_produto.receita, "Descrição da receita é obrigatória")
        }

        return ProdutoModel.update(id, novosDados_produto)     
    }

    async deletar(id) {
        //Valida o ID e verifica se o produto a ser deletado existe
        id = validarId(id)

        const produto = await ProdutoModel.findById(id)

        if(!produto) {
            throw new ErroNaoEncontrado("Produto para deletar não foi encontrado.")
        }

        return ProdutoModel.delete(id)
    }

}

export default new ProdutoService()