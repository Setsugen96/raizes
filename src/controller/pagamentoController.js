import PagamentoService from "../service/PagamentoService.js";


class PagamentoController {

    async pagamento(req, res) {

        try {

            const idPagamento = req.params
            const result = req.body

            await PagamentoService.processarPagamento(idPagamento.id, result.resultado)

            return res.status(200).json({
                message: "Pagamento realizado com sucesso"
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
}

export default new PagamentoController()