import FidelidadeService from "../service/FidelidadeService.js";


class FidelidadeController {

    async update(req, res) {

        try {

            const idCliente = req.params.id
            const novosDados = req.body 

            const fidelidadeAtualizado = await FidelidadeService.alterar(idCliente, novosDados)
 
            return res.status(200).json({
                message: "Consentimento atualizado com sucesso",
                fidelidadeAtualizado: fidelidadeAtualizado
            })
                       
        } catch (error) {

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            if(error.name === "ErroConflito") {
                return res.status(409).json({
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
            const consentimento_lgpd = await FidelidadeService.buscarIdCliente(id)

            return res.status(200).json({
                message: "Status de Consentimento encontrado com sucesso",
                status_consentimento: consentimento_lgpd
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

export default new FidelidadeController()