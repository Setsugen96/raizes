import mysql from 'mysql2/promise'
import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const schemaPath = path.join(__dirname, 'schema.sql')
const schema = await fs.readFile(schemaPath, 'utf-8')

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true
})

await connection.query(`
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)

await connection.changeUser({
    database: process.env.DB_NAME
})

const [tabelas] = await connection.query(`SHOW TABLES`)

if (tabelas.length > 0) {
    console.log('Tabela já existente')
    await connection.end()
    process.exit(0)
}

await connection.query(schema)
console.log("Banco Criado com Sucesso")

await connection.end()