import ProdutoModel from "../model/produtoModel.js";

import ErroValidacao, {validarEstado, validarEntradaTexto} from "./untils.js";

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
            produto.estado = validarEstado(produto.estado)
            produto.receita = validarEntradaTexto(produto.receita, "Descrição da receita é obrigatório")
            return await ProdutoModel.create(produto)
    }

    async buscarPorId(id) {

        return await ProdutoModel.findById(id)
    }

    async listar(page, limit, estado) {

         if(estado) {
            estado = validarEstado(estado)
        }
        
        return await ProdutoModel.findAll(page, limit, estado )
    }

    async alterar(id, novosDados_produto) {

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
            novosDados_produto.estado = validarEstado(novosDados_produto.estado)
        }

        if(novosDados_produto.receita !== undefined) {
            novosDados_produto.receita = validarEntradaTexto(novosDados_produto.receita, "Descrição da receita é obrigatória")
        }

        const result = await ProdutoModel.update(id, novosDados_produto)

        return result
        
    }

    async deletar(id) {

        return await ProdutoModel.delete(id)
    }

}

export default new ProdutoService()