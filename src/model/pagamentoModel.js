import connection from "../config/database.js";



class PagamentoModel {

    async create(pagamento) {
        const sql = 'INSERT into pagamento (pedido_id, metodo_pagamento, valor, status_pagamento) VALUES (?, ?, ?, ?)'
        await connection.execute(sql, [pagamento.pedido_id, pagamento.metodo_pagamento, pagamento.valor, pagamento.status_pagamento])
        
    }
}

export default new PagamentoModel()