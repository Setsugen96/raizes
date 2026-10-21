import FidelidadeService from "../service/FidelidadeService.js";


class FidelidadeController {

    async update(req, res) {

        try {

            const idCliente = req.params.id
            const novosDados = req.body 

            const fidelidadeAtualizado = await FidelidadeService.alterar(idCliente, novosDados)

            if(fidelidadeAtualizado.affectedRows > 0) {
                 return res.status(200).json({
                    message: "Consentimento atualizado com sucesso"
                })
            }
             
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

    async show(req, res) {

        try {

            const id = req.params.id
            const consentimento_lgpd = await FidelidadeService.buscarIdCliente(id)

            if(consentimento_lgpd) {

                return res.status(200).json({
                    message: "Status de Consentimento encontrado com sucesso",
                    status_consentimento: consentimento_lgpd
                })
            }

            return res.status(400).json({
                message: "Consentimento não encontrado"
            })


        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export default new FidelidadeController()