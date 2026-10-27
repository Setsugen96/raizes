import CardapioService from "../service/CardapioService.js";


class CardapioController {

    async store(req, res) {

        try {

            const novoCardapio = req.body
            const cardapioCadastrado = await CardapioService.cadastrar(novoCardapio)

            return res.status(201).json({
                message: "Cardapio cadastrado com sucesso",
                cardapio: cardapioCadastrado
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
            const cardapioEncontrado = await CardapioService.buscarPorId(id)      
                   
            return res.status(200).json({
                    message: "Linha do cardápio Encontrado com sucesso",
                    cardapio: cardapioEncontrado
                })      
                
        } catch (error) {

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }
             
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
            const novosDados = req.body
        
            const cardapioAtualizado = await CardapioService.alterar(id, novosDados)
               
            return res.status(200).json({
                message: "Cardápio alterado com sucesso.",
                cardapioAtualizado: cardapioAtualizado
            })
                                      
        } catch(error) {
        
            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Esse produto já existe na loja"
                })
            }

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
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
            const cardapioDeletado = await CardapioService.deletar(id)
            
            return res.status(200).json({
                message: "Cardápio deletado com sucesso",
                cardapioDeletado: cardapioDeletado
            })
             
        } catch (error) {
                
            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }            
    }
}

export default new CardapioController()