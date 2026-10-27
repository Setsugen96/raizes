import ProdutoModel from "../model/produtoModel.js";

import ErroValidacao, {validarEntradaTexto, estadosDisponveis, validarSet, ErroNaoEncontrado} from "./untils.js";

class ProdutoService {

    validarPrecoProduto(novo_preco) {

        if(novo_preco === undefined || novo_preco === null || novo_preco === '') {
            throw new ErroValidacao("O preço do produto é obrigatório.")
        }

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
            produto.nome = validarEntradaTexto(produto.nome, "Nome do produto é obrigatório")
            produto.preco = this.validarPrecoProduto(produto.preco)
            produto.estado = validarSet(produto.estado, estadosDisponveis, "Estado inválido")
            produto.receita = validarEntradaTexto(produto.receita, "Descrição da receita é obrigatório")
            return ProdutoModel.create(produto)
    }

    async buscarPorId(id) {

        const produto = await ProdutoModel.findById(id) 

        if(!produto) {
            throw new ErroNaoEncontrado("Produto não encontrado")
        }

        return produto
    }

    async listar(page, limit, estado) {

         if(estado) {
            estado = validarSet(estado, estadosDisponveis, "Estado inválido")
        }
        
        return ProdutoModel.findAll(page, limit, estado )
    }

    async alterar(id, novosDados_produto) {

        const produto = await ProdutoModel.findById(id) 

        if(!produto) {
            throw new ErroNaoEncontrado("Produto para alterar não encontrado")
        }

        if (novosDados_produto.nome === undefined && novosDados_produto.preco === undefined && novosDados_produto.estado === undefined && novosDados_produto.receita === undefined) {
            throw new ErroValidacao("Nenhum dado foi informado para atualização.")
        }

        if(novosDados_produto.nome !== undefined) {
            novosDados_produto.nome = validarEntradaTexto(novosDados_produto.nome, "Nome do produto é obrigatório")
        }

        if(novosDados_produto.preco !== undefined) {
            novosDados_produto.preco = this.validarPrecoProduto(novosDados_produto.preco)
        }

        if(novosDados_produto.estado !== undefined) {
            novosDados_produto.estado = validarSet(novosDados_produto.estado, estadosDisponveis, "Estado inválido")
        }

        if(novosDados_produto.receita !== undefined) {
            novosDados_produto.receita = validarEntradaTexto(novosDados_produto.receita, "Descrição da receita é obrigatória")
        }

        return ProdutoModel.update(id, novosDados_produto)     
    }

    async deletar(id) {

        const produto = await ProdutoModel.findById(id)

        if(!produto) {
            throw new ErroNaoEncontrado("Produto para deletar não foi encontrado.")
        }

        return ProdutoModel.delete(id)
    }

}

export default new ProdutoService()