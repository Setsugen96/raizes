import connection from "../src/config/database.js" 
import bcrypt from "bcrypt"

const listaLojas = [
    { nome: 'Loja Aracaju Centro', estado: 'SERGIPE' },
    { nome: 'Loja Socorro', estado: 'SERGIPE' },
    { nome: 'Loja Lagarto', estado: 'SERGIPE' },
    { nome: 'Loja Salvador Barra', estado: 'BAHIA' },
    { nome: 'Loja Feira de Santana', estado: 'BAHIA' },
    { nome: 'Loja Maceió Ponta Verde', estado: 'ALAGOAS' },
    { nome: 'Loja Arapiraca', estado: 'ALAGOAS' },
    { nome: 'Loja Recife Boa Viagem', estado: 'PERNAMBUCO' },
    { nome: 'Loja Olinda', estado: 'PERNAMBUCO' },
    { nome: 'Loja Caruaru', estado: 'PERNAMBUCO' },
    { nome: 'Loja Estância', estado: 'SERGIPE' },
    { nome: 'Loja Itabaiana', estado: 'SERGIPE' },
    { nome: 'Loja Petrolina', estado: 'PERNAMBUCO' },
    { nome: 'Loja Ilhéus', estado: 'BAHIA' },
    { nome: 'Loja Penedo', estado: 'ALAGOAS' }
]

const listaProdutos = [
    {
        nome: "Arroz Recheado",
        preco: "16.0",
        estado: "SERGIPE",
        receita: "arroz, calabresa, bacon, milho"
    },
    {
        nome: "Cuscuz Nordestino",
        preco: "10.0",
        estado: "SERGIPE",
        receita: "flocos de milho, manteiga, queijo coalho"
    },
    {
        nome: "Carne de Sol com Macaxeira",
        preco: "28.0",
        estado: "SERGIPE",
        receita: "carne de sol, macaxeira, manteiga de garrafa"
    },

    {
        nome: "Acarajé Recheado",
        preco: "15.0",
        estado: "BAHIA",
        receita: "feijão fradinho, cebola, camarão seco, vatapá"
    },
    {
        nome: "Moqueca Baiana",
        preco: "35.0",
        estado: "BAHIA",
        receita: "peixe, leite de coco, azeite de dendê, tomate, cebola"
    },
    {
        nome: "Vatapá",
        preco: "18.0",
        estado: "BAHIA",
        receita: "pão, camarão, leite de coco, amendoim, azeite de dendê"
    },

    {
        nome: "Sururu de Capote",
        preco: "24.0",
        estado: "ALAGOAS",
        receita: "sururu, leite de coco, tomate, cebola, pimentão"
    },
    {
        nome: "Cuscuz com Carne de Sol",
        preco: "22.0",
        estado: "ALAGOAS",
        receita: "cuscuz, carne de sol, queijo coalho, manteiga"
    },
    {
        nome: "Peixada Alagoana",
        preco: "32.0",
        estado: "ALAGOAS",
        receita: "peixe, batata, tomate, cebola, pimentão"
    },

    {
        nome: "Baião de Dois",
        preco: "20.0",
        estado: "PERNAMBUCO",
        receita: "arroz, feijão, queijo coalho, carne seca"
    },
    {
        nome: "Arrumadinho",
        preco: "23.0",
        estado: "PERNAMBUCO",
        receita: "feijão verde, carne de sol, farofa, vinagrete"
    },
    {
        nome: "Escondidinho de Carne Seca",
        preco: "26.0",
        estado: "PERNAMBUCO",
        receita: "carne seca, macaxeira, queijo coalho"
    },

    {
        nome: "Baião de Dois Cearense",
        preco: "21.0",
        estado: "CEARÁ",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        nome: "Carneiro Guisado",
        preco: "29.0",
        estado: "CEARÁ",
        receita: "carneiro, tomate, cebola, pimentão, cheiro verde"
    },
    {
        nome: "Paçoca de Carne de Sol",
        preco: "19.0",
        estado: "CEARÁ",
        receita: "carne de sol, farinha de mandioca, cebola"
    },

    {
        nome: "Arroz de Cuxá",
        preco: "22.0",
        estado: "MARANHÃO",
        receita: "arroz, vinagreira, camarão seco, gergelim"
    },
    {
        nome: "Torta de Camarão",
        preco: "30.0",
        estado: "MARANHÃO",
        receita: "camarão, ovos, batata, cebola, tomate"
    },
    {
        nome: "Peixe Frito com Baião",
        preco: "27.0",
        estado: "MARANHÃO",
        receita: "peixe, arroz, feijão, farinha de mandioca"
    },

    {
        nome: "Rubacão",
        preco: "23.0",
        estado: "PARAÍBA",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        nome: "Carne de Sol com Queijo Coalho",
        preco: "30.0",
        estado: "PARAÍBA",
        receita: "carne de sol, queijo coalho, macaxeira, manteiga"
    },
    {
        nome: "Cuscuz com Ovo",
        preco: "12.0",
        estado: "PARAÍBA",
        receita: "flocos de milho, ovos, manteiga"
    },

    {
        nome: "Maria Isabel",
        preco: "24.0",
        estado: "PIAUÍ",
        receita: "arroz, carne seca, cebola, pimentão"
    },
    {
        nome: "Paçoca de Carne",
        preco: "20.0",
        estado: "PIAUÍ",
        receita: "carne seca, farinha de mandioca, cebola"
    },
    {
        nome: "Arroz com Capote",
        preco: "28.0",
        estado: "PIAUÍ",
        receita: "arroz, galinha caipira, cebola, pimentão"
    },

    {
        nome: "Carne de Sol na Nata",
        preco: "32.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "carne de sol, nata, cebola, queijo coalho"
    },
    {
        nome: "Ginga com Tapioca",
        preco: "18.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "ginga, tapioca, cebola, coentro"
    },
    {
        nome: "Escondidinho de Camarão",
        preco: "29.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "camarão, macaxeira, queijo coalho, leite de coco"
    },

    {
        nome: "Macarronada Sergipana",
        preco: "25.0",
        estado: "SERGIPE",
        receita: "macarrão, carne moída, tomate, cebola, queijo coalho"
    },
    {
        nome: "Galinha de Capoeira com Pirão",
        preco: "32.0",
        estado: "SERGIPE",
        receita: "galinha caipira, farinha de mandioca, caldo de galinha, coentro"
    },
    {
        nome: "Queijada Sergipana",
        preco: "12.0",
        estado: "SERGIPE",
        receita: "queijo coalho, coco ralado, açúcar, ovos"
    },
    {
        nome: "Pirão de Leite com Carne de Sol",
        preco: "27.0",
        estado: "SERGIPE",
        receita: "leite, farinha de mandioca, carne de sol, manteiga de garrafa"
    },

    {
        nome: "Bobó de Camarão",
        preco: "34.0",
        estado: "BAHIA",
        receita: "camarão, aipim, leite de coco, azeite de dendê, coentro"
    },
    {
        nome: "Xinxim de Galinha",
        preco: "29.0",
        estado: "BAHIA",
        receita: "frango, amendoim, castanha de caju, leite de coco, azeite de dendê"
    },
    {
        nome: "Ensopado de Robalo",
        preco: "36.0",
        estado: "BAHIA",
        receita: "robalo, tomate, cebola, pimentão, leite de coco"
    },
    {
        nome: "Efó Baiano",
        preco: "24.0",
        estado: "BAHIA",
        receita: "folhas de língua-de-vaca, camarão seco, amendoim, azeite de dendê"
    },

    {
        nome: "Tapioca Recheada de Camarão",
        preco: "23.0",
        estado: "ALAGOAS",
        receita: "goma de tapioca, camarão, queijo coalho, leite de coco"
    },
    {
        nome: "Chiclete de Camarão",
        preco: "38.0",
        estado: "ALAGOAS",
        receita: "camarão, queijo muçarela, requeijão, creme de leite, tomate"
    },
    {
        nome: "Peixada de Penedo",
        preco: "33.0",
        estado: "ALAGOAS",
        receita: "peixe, leite de coco, batata, tomate, pimentão, coentro"
    },
    {
        nome: "Sururu ao Leite de Coco",
        preco: "26.0",
        estado: "ALAGOAS",
        receita: "sururu, leite de coco, cebola, tomate, coentro"
    },

    {
        nome: "Caldeirada Pernambucana",
        preco: "35.0",
        estado: "PERNAMBUCO",
        receita: "peixe, camarão, polvo, tomate, cebola, leite de coco"
    },
    {
        nome: "Cartola Pernambucana",
        preco: "16.0",
        estado: "PERNAMBUCO",
        receita: "banana, queijo manteiga, açúcar, canela"
    },
    {
        nome: "Bolo de Rolo",
        preco: "14.0",
        estado: "PERNAMBUCO",
        receita: "massa fina de bolo, goiabada, açúcar"
    },
    {
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

async function semearUsuarios(nome, email, senha, role, loja_id = null) {

    const senhaHash = await bcrypt.hash(senha, 10)

    const [result] = await connection.execute(
        `INSERT INTO usuario (nome, email, senha, role, loja_id)
         VALUES (?, ?, ?, ?, ?)`,
        [nome, email, senhaHash, role, loja_id]
    )

    if(role === 'CLIENTE') {
        await connection.execute('INSERT INTO fidelidade(cliente_id) VALUES(?)', [result.insertId])
    }
}

async function semearUsuariosTeste() {

    const [lojas] = await connection.execute('SELECT id FROM loja WHERE nome = ?',['Loja Aracaju Centro'])

    const lojaAracaju = lojas[0]

    await semearUsuarios(
        'Admin',
        'admin@raizes.com',
        '1234',
        'ADMINISTRADOR'
    )

    await semearUsuarios(
        'Gerente',
        'gerente@raizes.com',
        '1234',
        'GERENTE',
        lojaAracaju.id
    )

    await semearUsuarios(
        'Atendente',
        'atendente@raizes.com',
        '1234',
        'ATENDENTE',
        lojaAracaju.id
    )

    await semearUsuarios(
        'Cliente',
        'cliente@raizes.com',
        '1234',
        'CLIENTE'
    )
}

async function semearBancoLojas() {

    for(const loja of listaLojas) {

        await connection.execute('INSERT INTO loja (nome, estado) VALUES (?, ?)', [loja.nome, loja.estado])
    }
}

async function semearBancoProdutos() {

    for(const produto of listaProdutos) {

    await connection.execute('INSERT INTO produto (nome, preco, estado, receita) VALUES (?, ?, ?, ?)', 
        [produto.nome, produto.preco, produto.estado, produto.receita])
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