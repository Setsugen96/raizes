import connection from "../config/database.js";



class PagamentoModel {

    async create(pagamento, conexao = connection) {
        const sql = 'INSERT into pagamento (pedido_id, metodo_pagamento, valor) VALUES (?, ?, ?)'
        await conexao.execute(sql, [pagamento.pedido_id, pagamento.metodo_pagamento, pagamento.valor])
        
    }

    async findById(id) {
        const sql = 'SELECT * FROM pagamento WHERE id = ?'
        const [result] = await connection.execute(sql, [id])
        return result[0]
    }

    async update(id, status_atualizado) {

        const sql = 'UPDATE pagamento SET status_pagamento = ? WHERE id = ?'
        const [result] = await connection.execute(sql, [status_atualizado.status_pagamento , id])

        return result
    }

    async findByPedidoId(id) {
        const sql = 'SELECT * FROM pagamento WHERE pedido_id = ?'
        const [result] = await connection.execute(sql,[id])
        return result[0]
    }
}

export default new PagamentoModel()