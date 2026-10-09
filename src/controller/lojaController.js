
import LojaService from "../service/LojaService.js"


class LojaController {

    async store(req , res) {

        try {

            const novaLoja = req.body 
            const lojaCadastrada = await LojaService.cadastrar(novaLoja)

            return res.status(201).json({
                message: "Loja adicionada com sucesso.", 
                loja: lojaCadastrada
            })

        } catch (error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Já existe uma loja com esse nome."
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
            const lojaEncontrada = await LojaService.buscarPorId(id)      
            if(lojaEncontrada) {

                return res.status(200).json({
                message: "Loja Encontrada com sucesso",
                loja: lojaEncontrada
                })
            } 

            return res.status(404).json({
                    message: "Loja não encontrada."
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

            const lojas = await LojaService.listar(page, limit, estado)
            res.status(200).json(lojas)

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

            const lojaAtualizada = await LojaService.alterar(id, novosDados)

            if(lojaAtualizada.affectedRows > 0) {
                return res.status(200).json({
                    message: "Loja atualizada com sucesso."
                })
            } 

            return res.status(404).json({
                message: "Loja não encontrada"
            })
            
        } catch(error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Já existe uma loja com esse nome."
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

     async delete(req, res) {
        
        try {

            const id = req.params.id
            const lojaDeletada = await LojaService.deletar(id)
        
            if(lojaDeletada.affectedRows > 0) {

                return res.status(200).json({
                message: "Loja deletada com sucesso",
                loja: lojaDeletada
                })
            } 

            return res.status(404).json({
                message: "Loja para deletar não encontrada."
            })
            
            
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }            
    }
}

export default new LojaController()