import connection from "../src/config/database.js" 
import bcrypt from "bcrypt"

const listaLojas = [
    { id: 1, nome: 'Loja Aracaju Centro', estado: 'SERGIPE' },
    { id: 2, nome: 'Loja Socorro', estado: 'SERGIPE' },
    { id: 3, nome: 'Loja Lagarto', estado: 'SERGIPE' },
    { id: 4, nome: 'Loja Salvador Barra', estado: 'BAHIA' },
    { id: 5, nome: 'Loja Feira de Santana', estado: 'BAHIA' },
    { id: 6, nome: 'Loja Maceió Ponta Verde', estado: 'ALAGOAS' },
    { id: 7, nome: 'Loja Arapiraca', estado: 'ALAGOAS' },
    { id: 8, nome: 'Loja Recife Boa Viagem', estado: 'PERNAMBUCO' },
    { id: 9, nome: 'Loja Olinda', estado: 'PERNAMBUCO' },
    { id: 10, nome: 'Loja Caruaru', estado: 'PERNAMBUCO' },
    { id: 11, nome: 'Loja Estância', estado: 'SERGIPE' },
    { id: 12, nome: 'Loja Itabaiana', estado: 'SERGIPE' },
    { id: 13, nome: 'Loja Petrolina', estado: 'PERNAMBUCO' },
    { id: 14, nome: 'Loja Ilhéus', estado: 'BAHIA' },
    { id: 15, nome: 'Loja Penedo', estado: 'ALAGOAS' }
]

const listaProdutos = [
    {
        id: 1,
        nome: "Arroz Recheado",
        preco: "16.0",
        estado: "SERGIPE",
        receita: "arroz, calabresa, bacon, milho"
    },
    {
        id: 2,
        nome: "Cuscuz Nordestino",
        preco: "10.0",
        estado: "SERGIPE",
        receita: "flocos de milho, manteiga, queijo coalho"
    },
    {
        id: 3,
        nome: "Carne de Sol com Macaxeira",
        preco: "28.0",
        estado: "SERGIPE",
        receita: "carne de sol, macaxeira, manteiga de garrafa"
    },
    {
        id: 4,
        nome: "Acarajé Recheado",
        preco: "15.0",
        estado: "BAHIA",
        receita: "feijão fradinho, cebola, camarão seco, vatapá"
    },
    {
        id: 5,
        nome: "Moqueca Baiana",
        preco: "35.0",
        estado: "BAHIA",
        receita: "peixe, leite de coco, azeite de dendê, tomate, cebola"
    },
    {
        id: 6,
        nome: "Vatapá",
        preco: "18.0",
        estado: "BAHIA",
        receita: "pão, camarão, leite de coco, amendoim, azeite de dendê"
    },
    {
        id: 7,
        nome: "Sururu de Capote",
        preco: "24.0",
        estado: "ALAGOAS",
        receita: "sururu, leite de coco, tomate, cebola, pimentão"
    },
    {
        id: 8,
        nome: "Cuscuz com Carne de Sol",
        preco: "22.0",
        estado: "ALAGOAS",
        receita: "cuscuz, carne de sol, queijo coalho, manteiga"
    },
    {
        id: 9,
        nome: "Peixada Alagoana",
        preco: "32.0",
        estado: "ALAGOAS",
        receita: "peixe, batata, tomate, cebola, pimentão"
    },
    {
        id: 10,
        nome: "Baião de Dois",
        preco: "20.0",
        estado: "PERNAMBUCO",
        receita: "arroz, feijão, queijo coalho, carne seca"
    },
    {
        id: 11,
        nome: "Arrumadinho",
        preco: "23.0",
        estado: "PERNAMBUCO",
        receita: "feijão verde, carne de sol, farofa, vinagrete"
    },
    {
        id: 12,
        nome: "Escondidinho de Carne Seca",
        preco: "26.0",
        estado: "PERNAMBUCO",
        receita: "carne seca, macaxeira, queijo coalho"
    },
    {
        id: 13,
        nome: "Baião de Dois Cearense",
        preco: "21.0",
        estado: "CEARÁ",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        id: 14,
        nome: "Carneiro Guisado",
        preco: "29.0",
        estado: "CEARÁ",
        receita: "carneiro, tomate, cebola, pimentão, cheiro verde"
    },
    {
        id: 15,
        nome: "Paçoca de Carne de Sol",
        preco: "19.0",
        estado: "CEARÁ",
        receita: "carne de sol, farinha de mandioca, cebola"
    },
    {
        id: 16,
        nome: "Arroz de Cuxá",
        preco: "22.0",
        estado: "MARANHÃO",
        receita: "arroz, vinagreira, camarão seco, gergelim"
    },
    {
        id: 17,
        nome: "Torta de Camarão",
        preco: "30.0",
        estado: "MARANHÃO",
        receita: "camarão, ovos, batata, cebola, tomate"
    },
    {
        id: 18,
        nome: "Peixe Frito com Baião",
        preco: "27.0",
        estado: "MARANHÃO",
        receita: "peixe, arroz, feijão, farinha de mandioca"
    },
    {
        id: 19,
        nome: "Rubacão",
        preco: "23.0",
        estado: "PARAÍBA",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        id: 20,
        nome: "Carne de Sol com Queijo Coalho",
        preco: "30.0",
        estado: "PARAÍBA",
        receita: "carne de sol, queijo coalho, macaxeira, manteiga"
    },
    {
        id: 21,
        nome: "Cuscuz com Ovo",
        preco: "12.0",
        estado: "PARAÍBA",
        receita: "flocos de milho, ovos, manteiga"
    },
    {
        id: 22,
        nome: "Maria Isabel",
        preco: "24.0",
        estado: "PIAUÍ",
        receita: "arroz, carne seca, cebola, pimentão"
    },
    {
        id: 23,
        nome: "Paçoca de Carne",
        preco: "20.0",
        estado: "PIAUÍ",
        receita: "carne seca, farinha de mandioca, cebola"
    },
    {
        id: 24,
        nome: "Arroz com Capote",
        preco: "28.0",
        estado: "PIAUÍ",
        receita: "arroz, galinha caipira, cebola, pimentão"
    },
    {
        id: 25,
        nome: "Carne de Sol na Nata",
        preco: "32.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "carne de sol, nata, cebola, queijo coalho"
    },
    {
        id: 26,
        nome: "Ginga com Tapioca",
        preco: "18.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "ginga, tapioca, cebola, coentro"
    },
    {
        id: 27,
        nome: "Escondidinho de Camarão",
        preco: "29.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "camarão, macaxeira, queijo coalho, leite de coco"
    },
    {
        id: 28,
        nome: "Macarronada Sergipana",
        preco: "25.0",
        estado: "SERGIPE",
        receita: "macarrão, carne moída, tomate, cebola, queijo coalho"
    },
    {
        id: 29,
        nome: "Galinha de Capoeira com Pirão",
        preco: "32.0",
        estado: "SERGIPE",
        receita: "galinha caipira, farinha de mandioca, caldo de galinha, coentro"
    },
    {
        id: 30,
        nome: "Queijada Sergipana",
        preco: "12.0",
        estado: "SERGIPE",
        receita: "queijo coalho, coco ralado, açúcar, ovos"
    },
    {
        id: 31,
        nome: "Pirão de Leite com Carne de Sol",
        preco: "27.0",
        estado: "SERGIPE",
        receita: "leite, farinha de mandioca, carne de sol, manteiga de garrafa"
    },
    {
        id: 32,
        nome: "Bobó de Camarão",
        preco: "34.0",
        estado: "BAHIA",
        receita: "camarão, aipim, leite de coco, azeite de dendê, coentro"
    },
    {
        id: 33,
        nome: "Xinxim de Galinha",
        preco: "29.0",
        estado: "BAHIA",
        receita: "frango, amendoim, castanha de caju, leite de coco, azeite de dendê"
    },
    {
        id: 34,
        nome: "Ensopado de Robalo",
        preco: "36.0",
        estado: "BAHIA",
        receita: "robalo, tomate, cebola, pimentão, leite de coco"
    },
    {
        id: 35,
        nome: "Efó Baiano",
        preco: "24.0",
        estado: "BAHIA",
        receita: "folhas de língua-de-vaca, camarão seco, amendoim, azeite de dendê"
    },
    {
        id: 36,
        nome: "Tapioca Recheada de Camarão",
        preco: "23.0",
        estado: "ALAGOAS",
        receita: "goma de tapioca, camarão, queijo coalho, leite de coco"
    },
    {
        id: 37,
        nome: "Chiclete de Camarão",
        preco: "38.0",
        estado: "ALAGOAS",
        receita: "camarão, queijo muçarela, requeijão, creme de leite, tomate"
    },
    {
        id: 38,
        nome: "Peixada de Penedo",
        preco: "33.0",
        estado: "ALAGOAS",
        receita: "peixe, leite de coco, batata, tomate, pimentão, coentro"
    },
    {
        id: 39,
        nome: "Sururu ao Leite de Coco",
        preco: "26.0",
        estado: "ALAGOAS",
        receita: "sururu, leite de coco, cebola, tomate, coentro"
    },
    {
        id: 40,
        nome: "Caldeirada Pernambucana",
        preco: "35.0",
        estado: "PERNAMBUCO",
        receita: "peixe, camarão, polvo, tomate, cebola, leite de coco"
    },
    {
        id: 41,
        nome: "Cartola Pernambucana",
        preco: "16.0",
        estado: "PERNAMBUCO",
        receita: "banana, queijo manteiga, açúcar, canela"
    },
    {
        id: 42,
        nome: "Bolo de Rolo",
        preco: "14.0",
        estado: "PERNAMBUCO",
        receita: "massa fina de bolo, goiabada, açúcar"
    },
    {
        id: 43,
        nome: "Sopa de Feijão Pernambucana",
        preco: "19.0",
        estado: "PERNAMBUCO",
        receita: "feijão, macarrão, batata, cenoura, carne seca"
    }
]

const listaCardapios = [
    {
        loja: "Loja Aracaju Centro",
        produto: "Galinha de Capoeira com Pirão",
        data_inicio: "2026-06-01",
        data_fim: "2026-06-15"
    },
    {
        loja: "Loja Aracaju Centro",
        produto: "Macarronada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Aracaju Centro",
        produto: "Pirão de Leite com Carne de Sol",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Socorro",
        produto: "Macarronada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Socorro",
        produto: "Queijada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Socorro",
        produto: "Pirão de Leite com Carne de Sol",
        data_inicio: "2026-06-10",
        data_fim: "2026-06-25"
    },
    {
        loja: "Loja Lagarto",
        produto: "Arroz Recheado",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Lagarto",
        produto: "Macarronada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Lagarto",
        produto: "Galinha de Capoeira com Pirão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Estância",
        produto: "Arroz Recheado",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Estância",
        produto: "Cuscuz Nordestino",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Estância",
        produto: "Queijada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Itabaiana",
        produto: "Carne de Sol com Macaxeira",
        data_inicio: "2026-06-05",
        data_fim: "2026-06-20"
    },
    {
        loja: "Loja Itabaiana",
        produto: "Cuscuz Nordestino",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Itabaiana",
        produto: "Macarronada Sergipana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Salvador Barra",
        produto: "Bobó de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Salvador Barra",
        produto: "Xinxim de Galinha",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Salvador Barra",
        produto: "Efó Baiano",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Feira de Santana",
        produto: "Acarajé Recheado",
        data_inicio: "2026-06-12",
        data_fim: "2026-06-30"
    },
    {
        loja: "Loja Feira de Santana",
        produto: "Bobó de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Feira de Santana",
        produto: "Xinxim de Galinha",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Ilhéus",
        produto: "Moqueca Baiana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Ilhéus",
        produto: "Bobó de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Ilhéus",
        produto: "Ensopado de Robalo",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Maceió Ponta Verde",
        produto: "Chiclete de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Maceió Ponta Verde",
        produto: "Tapioca Recheada de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Maceió Ponta Verde",
        produto: "Sururu ao Leite de Coco",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Arapiraca",
        produto: "Peixada Alagoana",
        data_inicio: "2026-06-08",
        data_fim: "2026-06-22"
    },
    {
        loja: "Loja Arapiraca",
        produto: "Chiclete de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Arapiraca",
        produto: "Sururu ao Leite de Coco",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Penedo",
        produto: "Peixada Alagoana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Penedo",
        produto: "Chiclete de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Penedo",
        produto: "Tapioca Recheada de Camarão",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Recife Boa Viagem",
        produto: "Caldeirada Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Recife Boa Viagem",
        produto: "Cartola Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Recife Boa Viagem",
        produto: "Bolo de Rolo",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Olinda",
        produto: "Arrumadinho",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Olinda",
        produto: "Caldeirada Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Olinda",
        produto: "Cartola Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Caruaru",
        produto: "Baião de Dois",
        data_inicio: "2026-06-15",
        data_fim: "2026-06-30"
    },
    {
        loja: "Loja Caruaru",
        produto: "Cartola Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Caruaru",
        produto: "Sopa de Feijão Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Petrolina",
        produto: "Escondidinho de Carne Seca",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Petrolina",
        produto: "Caldeirada Pernambucana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Petrolina",
        produto: "Bolo de Rolo",
        data_inicio: null,
        data_fim: null
    }
]

async function semearUsuarios(id, nome, email, senha, role, loja_id = null) {

    const senhaHash = await bcrypt.hash(senha, 10)

    const [result] = await connection.execute(
        `INSERT INTO usuario (id, nome, email, senha, role, loja_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, nome, email, senhaHash, role, loja_id]
    )

    if(role === 'CLIENTE') {
        await connection.execute('INSERT INTO fidelidade(cliente_id) VALUES(?)', [result.insertId])
    }
}

async function semearUsuariosTeste() {

    const [lojas] = await connection.execute('SELECT id FROM loja WHERE nome = ?',['Loja Aracaju Centro'])

    const lojaAracaju = lojas[0]

    await semearUsuarios(
        1,
        'Admin',
        'admin@raizes.com',
        '1234',
        'ADMINISTRADOR'
    )

    await semearUsuarios(
        2,
        'Gerente',
        'gerente@raizes.com',
        '1234',
        'GERENTE',
        lojaAracaju.id
    )

    await semearUsuarios(
        3,
        'Atendente',
        'atendente@raizes.com',
        '1234',
        'ATENDENTE',
        lojaAracaju.id
    )

    await semearUsuarios(
        4,
        'Cliente',
        'cliente@raizes.com',
        '1234',
        'CLIENTE'
    )
}

async function semearBancoLojas() {

    for(const loja of listaLojas) {

        await connection.execute('INSERT INTO loja (id, nome, estado) VALUES (?, ?, ?)', [loja.id, loja.nome, loja.estado])
    }
}

async function semearBancoProdutos() {

    for(const produto of listaProdutos) {

    await connection.execute('INSERT INTO produto (id, nome, preco, estado, receita) VALUES (?, ?, ?, ?, ?)', 
        [produto.id, produto.nome, produto.preco, produto.estado, produto.receita])
    }
}

async function semearBancoCardapio() {

    const [lojas] = await connection.execute('SELECT id, nome, estado FROM loja')
    const [produtos] = await connection.execute('SELECT id, nome, estado FROM produto')

    for(const item of listaCardapios) {

        const lojaEncontrada = lojas.find(l => l.nome === item.loja)
        const produtoEncontrado = produtos.find(p => p.nome === item.produto && p.estado === lojaEncontrada?.estado)

        await connection.execute(`INSERT INTO cardapio (loja_id, produto_id, data_inicio, data_fim) VALUES (?, ?, ?, ?)`, 
            [
                lojaEncontrada.id,
                produtoEncontrado.id,
                item.data_inicio ?? null,
                item.data_fim ?? null
            ]
        )
    }
}

async function executarTodasAsSeeds() {
    
    await semearBancoLojas()
    await semearBancoProdutos()
    await semearBancoCardapio()
    await semearUsuariosTeste()
}

async function iniciarSeed() {

   await executarTodasAsSeeds()
   console.log("Seeds executadas com sucesso.")
   await connection.end()
    
}

iniciarSeed()