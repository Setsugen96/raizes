import ProdutoService from "../service/ProdutoService.js";



class ProdutoController {

    async store(req, res) {

        try {
            
            const novo_produto = req.body
            const produto_cadastrado = await ProdutoService.cadastrar(novo_produto)

            return res.status(201).json({
                message: "Produto cadastrado com sucesso",
                produto: produto_cadastrado
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
            const produto_encontrado = await ProdutoService.buscarPorId(id)
            
            if(produto_encontrado) {
                return res.status(200).json({
                message: "Produto encontrado com sucesso",
                produto: produto_encontrado
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
            const novos_dados = req.body
    
            const produto_atualizado = await ProdutoService.alterar(id, novos_dados)
    
            if(produto_atualizado.affectedRows > 0) {
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
                const produto_deletado = await ProdutoService.deletar(id)
                
                if(produto_deletado.affectedRows > 0) {
                    return res.status(200).json({
                    message: "Produto deletado com sucesso",
                    produto: produto_deletado
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
