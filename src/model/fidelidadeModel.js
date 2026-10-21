import connection from "../config/database.js";

class FidelidadeModel {

    async create(fidelidade) {
        
        const sql = 'INSERT INTO fidelidade(cliente_id) VALUES(?)'

        await connection.execute(sql, [fidelidade.cliente_id])
    }

    async findByClienteId(cliente_id) {
        const sql = 'SELECT * FROM fidelidade WHERE cliente_id = ?'
        const [result] = await connection.execute(sql, [cliente_id])
        return result[0]
    }

    async update(cliente_id, consentimento) {

        const sql = 'UPDATE fidelidade SET consentimento_lgpd = ?, versao_termo = ?, data_consentimento = ? WHERE cliente_id = ?'
        const [result] = await connection.execute(sql, [
            consentimento.consentimento_lgpd, 
            consentimento.versao_termo, 
            consentimento.data_consentimento, 
            cliente_id
        ])

        return result 

    }
}


export default new FidelidadeModel()