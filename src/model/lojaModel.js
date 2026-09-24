import connection from "../config/database.js"

class LojaModel {

    async create(loja) {
        const sql = 'INSERT INTO loja (nome, estado) VALUES (?, ?)'
        const[result] = await connection.execute(sql, [loja.nome, loja.estado])

        return {
            id : result.insertId,
            nome: loja.nome, 
            estado: loja.estado
        }
    }

    async findById(id) {
        const sql = 'SELECT * FROM loja WHERE id = ?'
        const [result] = await connection.execute(sql, [id])
        return result[0]
    }

    async findAll(page, limit, estado) {

        const params = []
        const fields = []

        if(estado) {
            fields.push('WHERE estado = ?')
            params.push(estado)
        }

        if(page && limit) {
            const pageNumber = Number(page)
            const limitNumber = Number(limit)
            const offset = (pageNumber - 1) * limitNumber
            fields.push('LIMIT ? OFFSET ?')
            params.push(limitNumber, offset)
        }

        const sql = `SELECT * FROM loja ${fields.join(' ')}`
        
        const [result] = await connection.execute(sql, params)
        return result 
    }

    async update(id, loja_atualizada) {

        const params = []
        const fields = []

        if(loja_atualizada.nome !== undefined) {
            fields.push('nome = ?')
            params.push(loja_atualizada.nome)
        }

        if(loja_atualizada.estado !== undefined) {
            fields.push('estado = ?')
            params.push(loja_atualizada.estado)
        }

        const sql = `UPDATE loja SET ${fields.join(', ')} WHERE id = ?`
        params.push(id)

        const [result] = await connection.execute(sql, params)


        return result 
    }

    async delete(id) {
        const sql = 'DELETE FROM loja WHERE id=?'
        const [result] = await connection.execute(sql, [id])
        return result
    }
}

    


export default new LojaModel()