import connection from "../config/database.js"


class PedidoModel {

    async create(pedido, conexao = connection) {
        const sql = 'INSERT INTO pedido (cliente_id, loja_id, canal_pedido, valor_total) VALUES (?, ?, ?, ?)'
        const [result] = await conexao.execute(sql, [
            pedido.cliente_id, 
            pedido.loja_id, 
            pedido.canal_pedido, 
            pedido.valor_total,
        ])

        const  [rows] = await conexao.execute('SELECT *FROM pedido WHERE id = ?', [result.insertId])
        return rows[0]
    }

    
async findById(id) {

    const sql = `
        SELECT
            p.*,
            u.nome AS cliente_nome,
            l.nome AS loja_nome,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'produto_id', ip.produto_id,
                        'produto_nome', pr.nome,
                        'quantidade', ip.quantidade,
                        'preco_unidade', ip.preco_unidade,
                        'receita', pr.receita
                    )
                )
                FROM itens_pedido ip
                INNER JOIN produto pr
                    ON ip.produto_id = pr.id
                WHERE ip.pedido_id = p.id
            ) AS itens
        FROM pedido p
        INNER JOIN usuario u
            ON p.cliente_id = u.id
        INNER JOIN loja l
            ON p.loja_id = l.id
        WHERE p.id = ?
    `
    const [result] = await connection.execute(sql, [id]);

    return result[0]
}   


    async findPedidoStatus(cliente_id) {
        const sql = 'SELECT * FROM pedido WHERE cliente_id = ? AND status_pedido NOT IN (?, ?)'

        const [result] = await connection.execute(sql, [cliente_id, 'FINALIZADO', 'CANCELADO'])

        return result [0]
    }

    async findAll(page, limit, cliente_id, loja_id, canal_pedido, status_pedido) {

        const params = []
        const fields = []
        let sql = 'SELECT * FROM pedido'

        if(cliente_id) {
            fields.push('WHERE cliente_id = ?')
            params.push(cliente_id)
        }

        if(loja_id) {

            if(cliente_id) {
                fields.push('AND loja_id = ?')
            } else {
                fields.push('WHERE loja_id = ?')
            }
            params.push(loja_id)    
        }

        if(canal_pedido) {

            if(cliente_id || loja_id) {
                fields.push('AND canal_pedido = ?')
            } else {
                fields.push('WHERE canal_pedido = ?')
            }
            params.push(canal_pedido)
        }

        if(status_pedido) {

            if(cliente_id || loja_id || canal_pedido) {
                fields.push('AND status_pedido = ?')
            } else {
                fields.push('WHERE status_pedido = ?')
            }
            params.push(status_pedido)
        }

        if(page && limit) {
            const pageNumber = Number(page)
            const limitNumber = Number(limit)
            const offset = (pageNumber - 1) * limitNumber
            fields.push('LIMIT ? OFFSET ?')
            params.push(limitNumber, offset)
        }

        if(fields.length > 0) {
            sql += ' ' + fields.join(' ')
        }

        const [result] = await connection.execute(sql, params)
        return result

    }

    async update(id, pedido_atualizado) {

        const params = []
        const fields = []

        if(pedido_atualizado.canal_pedido !== undefined) {
            fields.push('canal_pedido = ?')
            params.push(pedido_atualizado.canal_pedido)
        }

        if(pedido_atualizado.status_pedido !== undefined) {
            fields.push('status_pedido = ?')
            params.push(pedido_atualizado.status_pedido)
        }

        const sql = `UPDATE pedido SET ${fields.join(', ')} WHERE id = ?`
        params.push(id)

        const [result] = await connection.execute(sql, params)

        return result
    }

    async delete(id) {
        const sql = 'DELETE FROM pedido WHERE id=?'
        const [result] = await connection.execute(sql, [id])
        return result
    }
}

export default new PedidoModel()
