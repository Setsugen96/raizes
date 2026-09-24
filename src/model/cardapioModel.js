import connection from "../config/database.js";


class CardapioModel {

    async create(cardapio) {
        const sql = 'INSERT INTO cardapio (loja_id, produto_id, data_inicio, data_fim) VALUES (?, ?, ?, ?)'
        const [result] = await connection.execute(sql, [cardapio.loja_id, cardapio.produto_id, cardapio.data_inicio ?? null, cardapio.data_fim ?? null])

        return {
            id: result.insertId,
            loja_id: cardapio.loja_id,
            produto_id: cardapio.produto_id,
            data_inicio: cardapio.data_inicio ?? null,
            data_fim: cardapio.data_fim ?? null      
        }
    }

    async findById(id) {
         const sql = `
         SELECT 
            c.id,
            c.loja_id,
            l.nome AS loja_nome,
            l.estado AS loja_estado,
            c.produto_id,
            p.nome AS produto_nome,
            p.preco AS produto_preco,
            c.data_inicio,
            c.data_fim
        FROM cardapio c
        JOIN loja l ON c.loja_id = l.id
        JOIN produto p ON c.produto_id = p.id
        WHERE c.id = ?
        `
        const [result] = await connection.execute(sql, [id])
        const cardapio =  result[0]

        return cardapio
    }

    async findAll(page, limit, loja_id) {

        const params = []
        const fields = []
        let sql 

        if(loja_id) {

            sql = `
            SELECT
                cardapio.id,
                cardapio.produto_id,
                produto.nome AS produto,
                produto.preco,
                cardapio.loja_id,
                loja.nome AS loja,
                loja.estado,
                cardapio.data_inicio,
                cardapio.data_fim
            FROM cardapio
            JOIN produto ON cardapio.produto_id = produto.id
            JOIN loja ON cardapio.loja_id = loja.id
            `

            fields.push('WHERE loja_id = ?')
            params.push(loja_id)
        } else {

            sql = `
            SELECT
                cardapio.id,
                cardapio.produto_id,
                produto.nome AS produto,
                cardapio.loja_id,
                loja.nome AS loja,
                loja.estado
            FROM cardapio
            JOIN produto ON cardapio.produto_id = produto.id
            JOIN loja ON cardapio.loja_id = loja.id
        `
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

    async update(id, cardapio_atualizado) {

        const params = []
        const fields = []

        if(cardapio_atualizado.loja_id !== undefined) {
            fields.push('loja_id = ?')
            params.push(cardapio_atualizado.loja_id)
        }

        if(cardapio_atualizado.produto_id !== undefined) {
            fields.push('produto_id = ?')
            params.push(cardapio_atualizado.produto_id)
        }

        if(cardapio_atualizado.data_inicio !== undefined) {
            fields.push('data_inicio = ?')
            params.push(cardapio_atualizado.data_inicio)
        }

        if(cardapio_atualizado.data_fim !== undefined) {
            fields.push('data_fim = ?')
            params.push(cardapio_atualizado.data_fim)
        }

        const sql = `UPDATE cardapio SET ${fields.join(', ')} WHERE id = ?`
        params.push(id)

        const [result] = await connection.execute(sql, params)


        return result
    }

    async delete(id) {
        const sql = 'DELETE FROM cardapio WHERE id=?'
        const [result] = await connection.execute(sql, [id])
        return result
    }

    
}


export default new CardapioModel()