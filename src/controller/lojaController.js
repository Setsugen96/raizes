
import LojaService from "../service/LojaService.js"


class LojaController {

    async store(req , res) {

        try {

            const nova_loja = req.body 
            const loja_cadastrada = await LojaService.cadastrar(nova_loja)

            return res.status(201).json({
                message: "Loja adicionada com sucesso.", 
                loja: loja_cadastrada
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
            const loja_encontrada = await LojaService.buscarPorId(id)      
            if(loja_encontrada) {

                return res.status(200).json({
                message: "Loja Encontrada com sucesso",
                loja: loja_encontrada
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
            const novos_dados = req.body

            const loja_atualizada = await LojaService.alterar(id, novos_dados)

            if(loja_atualizada.affectedRows > 0) {
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
            const loja_deletada = await LojaService.deletar(id)
        
            if(loja_deletada.affectedRows > 0) {

                return res.status(200).json({
                message: "Loja deletada com sucesso",
                loja: loja_deletada
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