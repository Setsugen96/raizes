import CardapioService from "../service/CardapioService.js";


class CardapioController {

    async store(req, res) {

        try {

            const novo_cardapio = req.body
            const cardapio_cadastrado = await CardapioService.cadastrar(novo_cardapio)
            return res.status(201).json({
                message: "Cardapio cadastrado com sucesso",
                cardapio: cardapio_cadastrado
            })

        } catch (error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Esse produto já está cadastrado nessa Loja"
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
                const cardapio_encontrado = await CardapioService.buscarPorId(id)      
                if(cardapio_encontrado) {
    
                    return res.status(200).json({
                    message: "Linha do cardápio Encontrado com sucesso",
                    cardapio: cardapio_encontrado
                    })
                } 
    
                return res.status(404).json({
                        message: "Cardápio não encontrado."
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
                const loja_id = req.query.loja_id
    
                const cardapio = await CardapioService.listar(page, limit, loja_id)
                res.status(200).json(cardapio)
    
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                })
            }      
    }

    async update(req, res) {
        
            try {
    
                const id = req.params.id 
                const novos_dados = req.body
        
                const cardapio_atualizado = await CardapioService.alterar(id, novos_dados)

                if(!cardapio_atualizado) {
                    return res.status(404).json({
                        message: "Cardápio não encontrado"
                    })
                }
        
                if(cardapio_atualizado.affectedRows > 0) {
                    return res.status(200).json({
                        message: "Cardápio alterado com sucesso."
                    })
                } 
                        
                } catch(error) {
        
                    if(error.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Esse produto já existe na loja"
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
                const cardapio_deletado = await CardapioService.deletar(id)
            
                if(cardapio_deletado.affectedRows > 0) {
    
                    return res.status(200).json({
                    message: "Cardápio deletado com sucesso",
                    cardapio: cardapio_deletado
                    })
                } 
    
                return res.status(404).json({
                    message: "Cardápio para deletar não encontrado."
                })
                
                
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                })
            }            
        }

}

export default new CardapioController()