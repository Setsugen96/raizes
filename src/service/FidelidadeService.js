import FidelidadeModel from "../model/fidelidadeModel.js";
import {ErroValidacao, ErroNaoEncontrado, validarConsentimento, validarId, verificarVersaoTermo} from "./utils.js";

class FidelidadeService {

    async alterar(cliente_id, consentimento) {

        //Valida o ID 
        cliente_id = validarId(cliente_id)

        // Verifica se Fidelidade do Cliente existe
        const fidelidadeCliente = await FidelidadeModel.findByClienteId(cliente_id)

        if(!fidelidadeCliente) {
            throw new ErroNaoEncontrado("Nenhum registro de fidelidade foi encontrado no nome desse usuário.")
        }

        // Verifica se no Body foi enviado o valor de consentimento para ser atualizado
        if(consentimento.consentimento_lgpd === undefined) {
            throw new ErroValidacao("Novo registro de consentimento não informado.")
        }

        //Valida consentimento pra evitar envio de consentimentos inválidos. Função validarConsentimento em utils.js
        consentimento.consentimento_lgpd = validarConsentimento(consentimento.consentimento_lgpd)
        
        // Verifica se o consentimento atualizado é true. Se for verifica se o termo é válido e registra a data em que o consentimento foi feito.
        if(consentimento.consentimento_lgpd === true) {
            consentimento.versao_termo = verificarVersaoTermo(consentimento.versao_termo)
            consentimento.data_consentimento = new Date()
        }

        // Verifica se o consentimento está sendo atualizado pra false, se for mantem as propriedades de versão e data null
        if(consentimento.consentimento_lgpd === false) {
            consentimento.versao_termo = null 
            consentimento.data_consentimento = null
        }

        return FidelidadeModel.update(cliente_id, consentimento)
    }


    async buscarIdCliente(id) {

        // Valida Id
        id = validarId(id)

        const fidelidade = await FidelidadeModel.findByClienteId(id)

        if(!fidelidade) {
            throw new ErroNaoEncontrado("Consentimento desse cliente não foi encontrado nos registros.")
        }

        return fidelidade
    }
}

export default new FidelidadeService()