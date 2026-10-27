import connection from "./src/config/database.js" // ajuste o caminho da sua conexão

const lojasFicticias = [
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

const produtosFicticios = [
    // Sergipe
    {
        nome: "Arroz Recheado - Sergipe",
        preco: "16.0",
        estado: "SERGIPE",
        receita: "arroz, calabresa, bacon, milho"
    },
    {
        nome: "Cuscuz Nordestino - Sergipe",
        preco: "10.0",
        estado: "SERGIPE",
        receita: "flocos de milho, manteiga, queijo coalho"
    },
    {
        nome: "Carne de Sol com Macaxeira - Sergipe",
        preco: "28.0",
        estado: "SERGIPE",
        receita: "carne de sol, macaxeira, manteiga de garrafa"
    },

    // Bahia
    {
        nome: "Acarajé Recheado - Bahia",
        preco: "15.0",
        estado: "BAHIA",
        receita: "feijão fradinho, cebola, camarão seco, vatapá"
    },
    {
        nome: "Moqueca Baiana - Bahia",
        preco: "35.0",
        estado: "BAHIA",
        receita: "peixe, leite de coco, azeite de dendê, tomate, cebola"
    },
    {
        nome: "Vatapá - Bahia",
        preco: "18.0",
        estado: "BAHIA",
        receita: "pão, camarão, leite de coco, amendoim, azeite de dendê"
    },

    // Alagoas
    {
        nome: "Sururu de Capote - Alagoas",
        preco: "24.0",
        estado: "ALAGOAS",
        receita: "sururu, leite de coco, tomate, cebola, pimentão"
    },
    {
        nome: "Cuscuz com Carne de Sol - Alagoas",
        preco: "22.0",
        estado: "ALAGOAS",
        receita: "cuscuz, carne de sol, queijo coalho, manteiga"
    },
    {
        nome: "Peixada Alagoana - Alagoas",
        preco: "32.0",
        estado: "ALAGOAS",
        receita: "peixe, batata, tomate, cebola, pimentão"
    },

    // Pernambuco
    {
        nome: "Baião de Dois - Pernambuco",
        preco: "20.0",
        estado: "PERNAMBUCO",
        receita: "arroz, feijão, queijo coalho, carne seca"
    },
    {
        nome: "Arrumadinho - Pernambuco",
        preco: "23.0",
        estado: "PERNAMBUCO",
        receita: "feijão verde, carne de sol, farofa, vinagrete"
    },
    {
        nome: "Escondidinho de Carne Seca - Pernambuco",
        preco: "26.0",
        estado: "PERNAMBUCO",
        receita: "carne seca, macaxeira, queijo coalho"
    },

    // Ceará
    {
        nome: "Baião de Dois Cearense - Ceará",
        preco: "21.0",
        estado: "CEARÁ",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        nome: "Carneiro Guisado - Ceará",
        preco: "29.0",
        estado: "CEARÁ",
        receita: "carneiro, tomate, cebola, pimentão, cheiro verde"
    },
    {
        nome: "Paçoca de Carne de Sol - Ceará",
        preco: "19.0",
        estado: "CEARÁ",
        receita: "carne de sol, farinha de mandioca, cebola"
    },

    // Maranhão
    {
        nome: "Arroz de Cuxá - Maranhão",
        preco: "22.0",
        estado: "MARANHÃO",
        receita: "arroz, vinagreira, camarão seco, gergelim"
    },
    {
        nome: "Torta de Camarão - Maranhão",
        preco: "30.0",
        estado: "MARANHÃO",
        receita: "camarão, ovos, batata, cebola, tomate"
    },
    {
        nome: "Peixe Frito com Baião - Maranhão",
        preco: "27.0",
        estado: "MARANHÃO",
        receita: "peixe, arroz, feijão, farinha de mandioca"
    },

    // Paraíba
    {
        nome: "Rubacão - Paraíba",
        preco: "23.0",
        estado: "PARAÍBA",
        receita: "arroz, feijão verde, queijo coalho, carne seca"
    },
    {
        nome: "Carne de Sol com Queijo Coalho - Paraíba",
        preco: "30.0",
        estado: "PARAÍBA",
        receita: "carne de sol, queijo coalho, macaxeira, manteiga"
    },
    {
        nome: "Cuscuz com Ovo - Paraíba",
        preco: "12.0",
        estado: "PARAÍBA",
        receita: "flocos de milho, ovos, manteiga"
    },

    // Piauí
    {
        nome: "Maria Isabel - Piauí",
        preco: "24.0",
        estado: "PIAUÍ",
        receita: "arroz, carne seca, cebola, pimentão"
    },
    {
        nome: "Paçoca de Carne - Piauí",
        preco: "20.0",
        estado: "PIAUÍ",
        receita: "carne seca, farinha de mandioca, cebola"
    },
    {
        nome: "Arroz com Capote - Piauí",
        preco: "28.0",
        estado: "PIAUÍ",
        receita: "arroz, galinha caipira, cebola, pimentão"
    },

    // Rio Grande do Norte
    {
        nome: "Carne de Sol na Nata - Rio Grande do Norte",
        preco: "32.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "carne de sol, nata, cebola, queijo coalho"
    },
    {
        nome: "Ginga com Tapioca - Rio Grande do Norte",
        preco: "18.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "ginga, tapioca, cebola, coentro"
    },
    {
        nome: "Escondidinho de Camarão - Rio Grande do Norte",
        preco: "29.0",
        estado: "RIO GRANDE DO NORTE",
        receita: "camarão, macaxeira, queijo coalho, leite de coco"
    }
]

async function semearBancoLojas() {
    try {
        for (const loja of lojasFicticias) {
            await connection.execute(
                'INSERT INTO Loja (nome, estado) VALUES (?, ?)',
                [loja.nome, loja.estado]
            )
        }
        console.log('Lojas semeadas com sucesso!')
    } catch (error) {
        console.error('Erro ao executar seed de lojas:', error.message)
    }
}

async function semearBancoProdutos() {
    try {
        for (const produto of produtosFicticios) {
            await connection.execute(
                'INSERT INTO Produto (nome, preco, estado, receita) VALUES (?, ?, ?, ?)',
                [produto.nome, produto.preco, produto.estado, produto.receita]
            )
        }
        console.log('Produtos semeados com sucesso!')
    } catch (error) {
        console.error('Erro ao executar seed dos produtos:', error.message)
    }
}

async function semearBancoCardapio() {
    try {
        // Busca lojas e produtos cadastrados no banco para pegar os IDs gerados
        const [lojas] = await connection.execute('SELECT id, estado FROM Loja')
        const [produtos] = await connection.execute('SELECT id, estado FROM Produto')

        for (const loja of lojas) {
            // Filtra os produtos que possuem o mesmo estado da loja
            const produtosCompativeis = produtos.filter(p => p.estado === loja.estado)

            for (const produto of produtosCompativeis) {
                await connection.execute(
                    'INSERT INTO cardapio (loja_id, produto_id, data_inicio, data_fim) VALUES (?, ?, NULL, NULL)',
                    [loja.id, produto.id]
                )
            }
        }
        console.log('Cardápio semeado com sucesso!')
    } catch (error) {
        console.error('Erro ao executar seed do cardápio:', error.message)
    } finally {
        process.exit()
    }
}

// Exemplo para rodar tudo em sequência se necessário:
async function executarTodasAsSeeds() {
    await semearBancoLojas()
    await semearBancoProdutos()
    await semearBancoCardapio()
}


executarTodasAsSeeds()