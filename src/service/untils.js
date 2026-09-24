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

export default class ErroValidacao extends Error {
    constructor(message) {
        super(message)
        this.name = "ErroValidacao"
    }
}

export function validarEstado(estado) {
        if(!estado || estado.trim() === '') {
            throw new ErroValidacao("Nome do estado é obrigatório.")
        }
            const estadoFormatado = estado.trim().toLowerCase()
        
            if(!estadosDisponveis.has(estadoFormatado)) {
                throw new ErroValidacao("Estado inválido.")
            }  
        
            return estadoFormatado.toUpperCase()
}

export function validarEntradaTexto(entrada, mensagem_erro) {
    if(!entrada || entrada.trim() === '') {
            throw new ErroValidacao(mensagem_erro)
        }
        
        return entrada.trim().replace(/\s+/g, ' ')
}

export function validarId(id) {
    if(id === '' || isNaN(id)) {
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