import connection from "../config/database.js"


class UsuarioModel {

    async create(usuario) {
        const sql = 'INSERT INTO usuario(nome, email, senha, role, loja_id) VALUES (?, ?, ?, ?, ?)'
        const [result] = await connection.execute(sql, [usuario.nome, usuario.email, usuario.senha, usuario.role, usuario.loja_id ?? null])

        return{
            id: result.insertId,
            nome: usuario.nome,
            email: usuario.email, 
            role: usuario.role,
            loja_id: usuario.loja_id ?? null 
        }
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM usuario WHERE email = ?'
        const [result] = await connection.execute(sql, [email])
        return result[0]
    }

    async findGerenteById(loja_id) {
        const sql = `SELECT * FROM usuario WHERE loja_id = ? AND role = 'GERENTE' `
        const [result] = await connection.execute(sql, [loja_id])
        return result[0]

    }


    async findById(id) {
        const sql = `
            SELECT
                u.id,
                u.nome,
                u.email,
                u.role,
                u.loja_id,
                l.nome AS loja_nome,
                l.estado AS loja_estado
            FROM usuario u
            LEFT JOIN loja l ON u.loja_id = l.id
            WHERE u.id = ?
        `
        const [result] = await connection.execute(sql, [id])
        return result[0]
    }
    
    async findAll(page, limit, role, loja_id) {

        const params = []
        const fields = []
      
        let sql = `
            SELECT
                usuario.id,
                usuario.email,
                usuario.role,
                usuario.loja_id,
                loja.nome AS loja,
                loja.estado
            FROM usuario
            LEFT JOIN loja ON usuario.loja_id = loja.id
            `
        
        if(role) {
            fields.push('WHERE role = ?')
            params.push(role)
        }

        if(loja_id) {

            if(role) {
                fields.push('AND usuario.loja_id = ?')
            } else {
                fields.push('WHERE usuario.loja_id = ?')
            }
            params.push(loja_id)
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

    async update(id, usuario_atualizado) {
        const params = []
        const fields = []

        if(usuario_atualizado.nome !== undefined) {
            fields.push('nome = ?')
            params.push(usuario_atualizado.nome)
        }

        if(usuario_atualizado.email !== undefined) {
            fields.push('email = ?')
            params.push(usuario_atualizado.email)
        }

        if(usuario_atualizado.senha !== undefined) {
            fields.push('senha = ?')
            params.push(usuario_atualizado.senha)
        }

        if(usuario_atualizado.role !== undefined) {
            fields.push('role = ?')
            params.push(usuario_atualizado.role)
        }

        if(usuario_atualizado.loja_id !== undefined) {
            fields.push('loja_id = ?')
            params.push(usuario_atualizado.loja_id)
        }

        const sql = `UPDATE usuario SET ${fields.join(', ')} WHERE id = ?`
        params.push(id)

        const [result] = await connection.execute(sql, params)

        return result 


    }

    async delete(id) {
        const sql = 'DELETE FROM usuario WHERE id=?'
        const [result] = await connection.execute(sql, [id])
        return result 
    }
}


export default new UsuarioModel()