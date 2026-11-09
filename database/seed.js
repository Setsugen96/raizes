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
    // Sergipe
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

    // Bahia
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

    // Alagoas
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

    // Pernambuco
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

    // Ceará
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

    // Maranhão
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

    // Paraíba
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

    // Piauí
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

    // Rio Grande do Norte
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
    }
]

const listaCardapios = [
    // Sergipe
    {
        loja: "Loja Aracaju Centro",
        produto: "Arroz Recheado",
        data_inicio: "2026-11-01",
        data_fim: "2026-11-30"
    },
    {
        loja: "Loja Aracaju Centro",
        produto: "Cuscuz Nordestino",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Socorro",
        produto: "Carne de Sol com Macaxeira",
        data_inicio: "2026-12-01",
        data_fim: "2026-12-31"
    },
    {
        loja: "Loja Socorro",
        produto: "Arroz Recheado",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Lagarto",
        produto: "Cuscuz Nordestino",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Estância",
        produto: "Carne de Sol com Macaxeira",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Itabaiana",
        produto: "Arroz Recheado",
        data_inicio: null,
        data_fim: null
    },

    // Bahia
    {
        loja: "Loja Salvador Barra",
        produto: "Moqueca Baiana",
        data_inicio: "2026-11-10",
        data_fim: "2026-12-10"
    },
    {
        loja: "Loja Salvador Barra",
        produto: "Acarajé Recheado",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Feira de Santana",
        produto: "Vatapá",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Ilhéus",
        produto: "Acarajé Recheado",
        data_inicio: null,
        data_fim: null
    },

    // Alagoas
    {
        loja: "Loja Maceió Ponta Verde",
        produto: "Sururu de Capote",
        data_inicio: "2026-11-05",
        data_fim: "2026-11-25"
    },
    {
        loja: "Loja Maceió Ponta Verde",
        produto: "Peixada Alagoana",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Arapiraca",
        produto: "Cuscuz com Carne de Sol",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Penedo",
        produto: "Sururu de Capote",
        data_inicio: null,
        data_fim: null
    },

    // Pernambuco
    {
        loja: "Loja Recife Boa Viagem",
        produto: "Arrumadinho",
        data_inicio: "2026-11-15",
        data_fim: "2026-12-15"
    },
    {
        loja: "Loja Recife Boa Viagem",
        produto: "Baião de Dois",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Olinda",
        produto: "Escondidinho de Carne Seca",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Caruaru",
        produto: "Arrumadinho",
        data_inicio: null,
        data_fim: null
    },
    {
        loja: "Loja Petrolina",
        produto: "Baião de Dois",
        data_inicio: null,
        data_fim: null
    }
]


async function semearUsuarios(nome, login, senha, role, loja_id = null) {

    if(!nome || !login || !senha || !role) {
        throw new Error("Dados do usuário não configurados.")
    }

    const rolesComLoja = ['GERENTE', 'ATENDENTE']

    if(rolesComLoja.includes(role) && !loja_id) {
        throw new Error(`O perfil ${role} precisa estar vinculado a uma loja.`)
    }


    if(!rolesComLoja.includes(role)) {
        loja_id = null
    }

    const [usuarios] = await connection.execute('SELECT id FROM usuario WHERE email = ?',[login])

    if(usuarios.length > 0) {
        console.log(`Usuário ${login} já está cadastrado.`)
        return
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    await connection.execute(
        `INSERT INTO usuario (nome, email, senha, role, loja_id)
         VALUES (?, ?, ?, ?, ?)`,
        [nome, login, senhaHash, role, loja_id]
    )

    console.log(`Usuário ${nome} (${role}) cadastrado!`)
}

async function semearUsuariosTeste() {

    const lojaAracaju = await LojaModel.findByNome('Loja Aracaju Centro')

    if(!lojaAracaju) {
        throw new Error("Loja Aracaju Centro não encontrada.")
    }

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

    try {

        for(const loja of listaLojas) {

            const [lojas] = await connection.execute('SELECT id FROM loja WHERE nome = ?', [loja.nome])

            if(lojas.length > 0) {
                continue 
            }

            await connection.execute('INSERT INTO loja (nome, estado) VALUES (?, ?)', [loja.nome, loja.estado])
        }

        console.log("Lojas semeadas e registradas!")

    } catch (error) {

        console.error("Erro ao executar seed de lojas", error.message)
        throw error
    }
}

async function semearBancoProdutos() {

    try {

        for(const produto of listaProdutos) {

            const [produtos] = await connection.execute('SELECT id FROM produto WHERE nome = ? AND estado = ?', [produto.nome, produto.estado])

            if(produtos.length > 0) {
                continue
            }

            await connection.execute('INSERT INTO produto (nome, preco, estado, receita) VALUES (?, ?, ?, ?)', 
                [produto.nome, produto.preco, produto.estado, produto.receita])
        }

        console.log("Produtos semeados e registrados!")

    } catch (error) {

        console.error("Erro ao executar seed de produtos", error.message)
        throw error
    }
    
}

async function semearBancoCardapio() {

    try {
        
        const [lojas] = await connection.execute('SELECT id, nome, estado FROM loja')
        const [produtos] = await connection.execute('SELECT id, nome, estado FROM produto')

        for(const item of listaCardapios) {

            const lojaEncontrada = lojas.find(l => l.nome === item.loja)

            const produtoEncontrado = produtos.find(p => p.nome === item.produto && p.estado === lojaEncontrada?.estado)

            if(!lojaEncontrada || !produtoEncontrado) {
                throw new Error(`Loja ou produto não encontrado`)
            }

            const [cardapios] = await connection.execute('SELECT id FROM cardapio WHERE loja_id = ? AND produto_id = ?', [lojaEncontrada.id, produtoEncontrado.id])

            if(cardapios.length > 0) {
                continue 
            }

            await connection.execute(`INSERT INTO cardapio (loja_id, produto_id, data_inicio, data_fim) VALUES (?, ?, ?, ?)`, 
                [
                    lojaEncontrada.id,
                    produtoEncontrado.id,
                    item.data_inicio ?? null,
                    item.data_fim ?? null
                ]
            )
        }

        console.log('Cardápio semeado com sucesso!')

    } catch (error) {

        console.error('Erro ao executar seed do cardápio:', error.message)
        throw error
    } 
}


async function executarTodasAsSeeds() {
    
    await semearBancoLojas()
    await semearBancoProdutos()
    await semearBancoCardapio()
    await semearUsuariosTeste()
}


async function iniciarSeed() {

    try {

        await executarTodasAsSeeds()
        console.log("Seeds executadas")

    } catch (error) {
        console.error ("Erro ao executar seeds", error.message)

    } finally {
        await connection.end()
    }
}

iniciarSeed()