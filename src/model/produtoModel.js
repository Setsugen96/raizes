import connection from "../config/database.js";


class ProdutoModel {

    async create(produto) {
        const sql = 'INSERT INTO produto (nome, preco, estado, receita) VALUES (?, ?, ?, ?)'
        const [result] = await connection.execute(sql, [produto.nome, produto.preco, produto.estado, produto.receita])

        return {
            id: result.insertId,
            nome: produto.nome,
            preco: produto.preco,
            estado: produto.estado,
            receita: produto.receita
        }
    }

    async findById(id) {
        const sql = 'SELECT * FROM produto WHERE id = ?'
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

        const sql = `SELECT * FROM produto ${fields.join(' ')}`

        const [result] = await connection.execute(sql, params)
        return result 
    }

    async update(id, produto_atualizado) {
 
        const params = []
        const fields = []

        if(produto_atualizado.nome !== undefined) {
            fields.push('nome = ?')
            params.push(produto_atualizado.nome)
        }

        if(produto_atualizado.preco !== undefined) {
            fields.push('preco = ?')
            params.push(produto_atualizado.preco)
        }

        if(produto_atualizado.estado !== undefined) {
            fields.push('estado = ?')
            params.push(produto_atualizado.estado)
        }

        if(produto_atualizado.receita !== undefined) {
            fields.push('receita = ?')
            params.push(produto_atualizado.receita)
        }

        const sql = `UPDATE produto SET ${fields.join(', ')} WHERE id = ?`
        params.push(id)

        const [result] = await connection.execute(sql, params)


        return result 
    }

    async delete(id) {
        const sql = 'DELETE FROM produto WHERE id=?'
        const [result] = await connection.execute(sql, [id])
        return result
    }
    
}


export default new ProdutoModel()