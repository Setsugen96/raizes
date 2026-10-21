import PagamentoModel from "../model/pagamentoModel.js";
import ErroValidacao, { validarMetodoPagamento } from "./untils.js";


class PagamentoService {


    async cadastrar(pagamento) {
        
        pagamento.metodo_pagamento = validarMetodoPagamento(pagamento.metodo_pagamento)

    }
}