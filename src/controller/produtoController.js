import ProdutoService from "../service/ProdutoService.js";



class ProdutoController {

    async store(req, res) {

        try {
            
            const novoProduto = req.body
            const produtoCadastrado = await ProdutoService.cadastrar(novoProduto)

            return res.status(201).json({
                message: "Produto cadastrado com sucesso",
                produto: produtoCadastrado
            })

        } catch (error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Já existe um produto com esse nome."
                })
            }

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })          
        }
    }

    async show(req, res) {
            
        try {

            const id = req.params.id
            const produtoEncontrado = await ProdutoService.buscarPorId(id)
            
            if(produtoEncontrado) {
                return res.status(200).json({
                message: "Produto encontrado com sucesso",
                produto: produtoEncontrado
                })
            } 
            return res.status(404).json({
                    message: "Produto não encontrado."
                })      
                
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                })
            }            
    }

    async index(req , res) {
    
        try {

            const page = req.query.page
            const limit = req.query.limit
            const estado = req.query.estado

            const produtos = await ProdutoService.listar(page, limit, estado)
            res.status(200).json(produtos)
    
        } catch (error) {

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }      
    }

    async update(req, res) {
    
        try {

            const id = req.params.id 
            const novosDados = req.body
    
            const produtoAtualizado = await ProdutoService.alterar(id, novosDados)
    
            if(produtoAtualizado.affectedRows > 0) {
                return res.status(200).json({
                    message: "Produto alterado com sucesso."
                })
            } 
    
            return res.status(404).json({
                message: "Produto não encontrado"
            })
                
            } catch(error) {
    
                if(error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Produto com esse nome já existe."
                    })
                }
    
                if(error.name == "ErroValidacao") {
                    return res.status(400).json({
                        message: error.message
                    })
                }
    
                return res.status(500).json({
                    message: error.message
                })          
            }        
        }

        async delete(req, res) {
                
            try {
        
                const id = req.params.id
                const produtoDeletado = await ProdutoService.deletar(id)
                
                if(produtoDeletado.affectedRows > 0) {
                    return res.status(200).json({
                    message: "Produto deletado com sucesso",
                    produto: produtoDeletado
                    })
                } 
        
                return res.status(404).json({
                    message: "Produto para deletar não foi encontrado."
                })
                    
                    
                } catch (error) {
                    return res.status(500).json({
                        message: error.message
                    })
                }            
            }



}

export default new ProdutoController()
