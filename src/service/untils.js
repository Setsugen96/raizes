export const estadosDisponveis = new Set([
    "alagoas",
    "bahia",
    "ceará",
    "maranhão",
    "paraíba",
    "pernambuco",
    "piauí",
    "rio grande do norte",
    "sergipe"
])

export const rolesDisponivels = new Set([
    "cliente",
    "gerente",
    "atendente"
])

export const canaisDisponiveis = new Set([
    "app",
    "totem",
    "balcão",
    "pickup",
    "web"
])

export const statusDisponiveis = new Set([
    "pendente",
    "em preparo",
    "em rota de entrega",
    "cancelado",
    "finalizado"
])

export const pagamentosDisponiveis = new Set([
    "pix",
    "cartao",
    "dinheiro"
])

export const statusPagamentos = new Set([
    "aguardando",
    "pago",
    "cancelado",
    "recusado"
])


export default class ErroValidacao extends Error {
    constructor(message) {
        super(message)
        this.name = "ErroValidacao"
    }
}

export class ErroNaoEncontrado extends Error {
    constructor(message) {
        super(message)
        this.name = "ErroNaoEncontrado"
    }
}

export class ErroConflito extends Error {
    constructor(message) {
        super(message)
        this.name = "ErroConflito"
    }
}

export function validarStatus(status) {

    if(!isNaN(Number(status))) {
        throw new ErroValidacao("Dados inválidos")
    }

    status = validarEntradaTexto(status, "Informar o novo status do Pedido é obrigatório.")
    const statusFormatado = status.toLowerCase()

    if(!statusDisponiveis.has(statusFormatado)) {
        throw new ErroValidacao("Status inválido.")
    }

    return statusFormatado.toUpperCase()
}

export function validarCanal(canal) {
    
     if(!isNaN(Number(canal))) {
        throw new ErroValidacao("Dados inválidos")
    }

    canal = validarEntradaTexto(canal, "Informar o Canal do Pedido é obrigatório.")
    const canalFormatado = canal.trim().toLowerCase()
        
    if(!canaisDisponiveis.has(canalFormatado)) {
        throw new ErroValidacao("Canal inválido.")
    }  
        
    return canalFormatado.toUpperCase()
}


export function validarSet(dado, array, mensagemErro) {

    if(!dado || dado.trim() === '') {
        throw new ErroValidacao(mensagemErro)
    }

    dado = validarEntradaTexto(dado, mensagemErro)

    const dadoFormatado = dado.trim().toLowerCase()

    if(!array.has(dadoFormatado)) {
        throw new ErroValidacao(mensagemErro)
    }

    return dadoFormatado.toUpperCase()
}


export function validarEntradaTexto(entrada, mensagem_erro) {
    if(!entrada || entrada.trim() === '') {
            throw new ErroValidacao(mensagem_erro)
        }
        
        return entrada.trim().replace(/\s+/g, ' ')
}

export function validarId(id) {
    if(id === '' || isNaN(id) || id < 1) {
        throw new ErroValidacao("Id dos dados inválido")
    }

    return id 
}

export function validarDatas(date_inicio, date_fim) {

    const[dia_inicio, mes_inicio, ano_inicio] = date_inicio.split('/')
    const[dia_fim, mes_fim, ano_fim] = date_fim.split('/')

    const data_inicio = new Date(`${ano_inicio}-${mes_inicio}-${dia_inicio}`)
    const data_fim = new Date(`${ano_fim}-${mes_fim}-${dia_fim}`)

    if(isNaN(data_inicio) || isNaN(data_fim)) {
        throw new ErroValidacao("Data inválida")
    }

    if(data_fim < data_inicio) {
        throw new ErroValidacao("Data de término do prazo deve ser depois da data de início")
    }

    return [`${ano_inicio}-${mes_inicio}-${dia_inicio}`, `${ano_fim}-${mes_fim}-${dia_fim}`]
}

export function formatarData(data) {
    
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}


export function validarConsentimento(consentimento) {
    if(typeof consentimento !== 'boolean') {
        throw new ErroValidacao("Consentimento informado é inválido (Envie true ou false).")
    }

    return consentimento
}

export function verificarVersaoTermo(versao) {

    const versaoTermoAtual = "1.0"

    if(versao !== versaoTermoAtual) {
        throw new ErroValidacao("Essa versão dos termos está inválida.")
    }

    return versaoTermoAtual
}

export function validarMetodoPagamento(tipo_pagamento) {

    if(!tipo_pagamento || tipo_pagamento.trim() === '') {
        throw new ErroValidacao("Método de pagamento é obrigatório.")
    }

    tipo_pagamento = validarEntradaTexto(tipo_pagamento, "Informar o método de pagamento é obrigatório")

    const metodo_pagamentoFormatado = tipo_pagamento.trim().toLowerCase()

    if(!pagamentosDisponiveis.has(metodo_pagamentoFormatado)) {
        throw new ErroValidacao("Método de Pagamento inválido")
    }

    return metodo_pagamentoFormatado.toUpperCase()
}

