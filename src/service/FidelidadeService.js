import FidelidadeModel from "../model/fidelidadeModel.js";
import ErroValidacao, { ErroNaoEncontrado, validarConsentimento, validarEntradaTexto, verificarVersaoTermo } from "./untils.js";




class FidelidadeService {

    async alterar(cliente_id, consentimento) {

        const fidelidadeCliente = await FidelidadeModel.findByClienteId(cliente_id)

        if(!fidelidadeCliente) {
            throw new ErroNaoEncontrado("Nenhum registro de fidelidade foi encontrado no nome desse usuário.")
        }

        if(consentimento.consentimento_lgpd === undefined) {
            throw new ErroValidacao("Novo registro de consentimento não informado.")
        }

        consentimento.consentimento_lgpd = validarConsentimento(consentimento.consentimento_lgpd)
        
        if(consentimento.consentimento_lgpd === true) {
            consentimento.versao_termo = verificarVersaoTermo(consentimento.versao_termo)
            consentimento.data_consentimento = new Date()
        }

        if(consentimento.consentimento_lgpd === false) {
            consentimento.versao_termo = null 
            consentimento.data_consentimento = null
        }

        return FidelidadeModel.update(cliente_id, consentimento)
    }

    async buscarIdCliente(id) {

        const fidelidade = FidelidadeModel.findByClienteId(id)

        if(!fidelidade) {
            throw new ErroNaoEncontrado("Consentimento desse cliente não foi encontrado nos registros.")
        }

        return FidelidadeModel.findByClienteId(id)
    }
}

export default new FidelidadeService()