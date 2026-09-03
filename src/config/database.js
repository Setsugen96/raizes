import mysql from 'mysql2'

const connection = mysql.createConnection({
    host:'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'db_raizes_do_nordeste'
})


connection.connect()

export const consulta = (sql, values='', mensagemReject) =>{
    return new Promise((resolve, reject) =>{
        connection.query(sql, values, (error, result) =>{
            if(error) {
                return reject(mensagemReject)
            } else {
                const rows = JSON.parse(JSON.stringify(result))
                return resolve(rows)
            }
        })
    })
}

export default connection

