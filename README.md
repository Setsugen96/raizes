# Raízes do Nordeste

## 1 - Sobre o projeto

Raízes do Nordeste é uma API REST desenvolvida com o objetivo de gerenciar uma rede de restaurantes especializados em culinária nordestina.

A API possui recursos para gerenciamento de usuários, lojas, produtos, cardápios, pedidos, pagamentos e programa de fidelidade.

O sistema utiliza autenticação JWT e controle de acesso baseado na role dos usuários.

## 2 - Tecnologias utilizadas

- **Node.js 24.22.1** – Ambiente de execução JavaScript.
- **Express 5.2.1** – Framework para construção da API REST.
- **MySQL 8.0.46** – Sistema de gerenciamento do banco de dados.
- **mysql2 3.24.3** – Biblioteca para conexão com o MySQL.
- **bcrypt 6.0.0** – Criptografia de senhas.
- **dotenv 17.4.2** – Gerenciamento de variáveis de ambiente.
- **jsonwebtoken 9.0.3** – Geração e validação de tokens JWT.
- **nodemon 3.1.14** – Reinicialização automática do servidor durante o desenvolvimento.

## 3 - Requisitos para executar o projeto

- Node.js 24.22.1 ou superior.
- MySQL 8.0 ou superior.
- npm (instalado junto com o Node.js).
- Git.

## 4 - Instalação e configuração

### 4.1 - Clonar o repositório

Clonar o repositório:

```bash
git clone https://github.com/Setsugen96/raizes
```

Entrar na pasta raiz do projeto:

```bash
cd raizes
```

### 4.2 - Instalar dependências

```bash
npm install
```

### 4.3 - Configurar variáveis de ambiente

Criar, na raiz do projeto, um arquivo `.env` com base no `.env.exemplo`.

Preencher as variáveis com as configurações do ambiente, como as credenciais do **MySQL** e a chave secreta utilizada no **JWT**.

O arquivo `.env` deve conter as configurações de conexão com o MySQL e a chave secreta utilizada na autenticação JWT. Consulte o arquivo `.env.examplo` para verificar as variáveis necessárias.

### 4.4 - Configurar o banco de dados

Inicie o servidor MySQL e execute o comando abaixo para criar automaticamente o banco de dados e suas respectivas tabelas:

```bash
npm run setup
```

O script utiliza as configurações definidas no arquivo `.env` e executa automaticamente o arquivo `database/schema.sql`.

Após a criação da estrutura do banco, execute o comando abaixo para inserir os dados iniciais:

```bash
npm run seed
```

A execução da seed cadastra automaticamente os dados iniciais do sistema, incluindo lojas, produtos, cardápios e contas de demonstração para cada perfil de usuário.

As credenciais das contas geradas estão disponíveis na seção **6.1 - Autenticação**.

**Observação:** O comando `npm run setup` verifica se o banco já possui tabelas. Caso existam, a execução é interrompida para proteger os dados existentes. Portanto, execute a seed somente após a configuração inicial do banco.


## 5 - Executando a API

Comando para iniciar a API:

```bash
npm start
```

Também é possível utilizar:

```bash
npm run dev
```

Esse comando utiliza o Nodemon, reiniciando automaticamente o servidor quando houver alterações nos arquivos do projeto.

## Observações

A execução da seed cadastra lojas, produtos, cardápios e contas de demonstração para os diferentes perfis de usuário (Administrador, Gerente, Atendente e Cliente).

O administrador possui permissões para gerenciar funcionários, lojas, produtos e cardápios, enquanto os demais perfis possuem permissões específicas de acordo com suas respectivas funções no sistema.



## 6 - Documentação da API (Swagger)

A documentação da API foi desenvolvida utilizando Swagger (OpenAPI), permitindo visualizar e testar os endpoints disponíveis.

**URL local:** http://localhost:3000/api-docs

A interface Swagger permite:

- Consultar os endpoints disponíveis e seus respectivos métodos HTTP.
- Visualizar os parâmetros e campos necessários para realizar as requisições.
- Consultar exemplos de requisições e respostas.
- Visualizar os possíveis códigos de status HTTP e suas respectivas descrições.
- Testar os endpoints diretamente pela interface, com a API em execução.

### 6.1 - Autenticação

Os endpoints protegidos exigem autenticação por meio de token JWT (JSON Web Token).

Para realizar testes utilizando o Swagger:

1. Acesse o endpoint `POST /auth/login` e informe as credenciais de acesso.
2. Realize o login e copie o token JWT retornado na resposta.
3. Clique no botão **Authorize**, localizado na parte superior da interface Swagger.
4. Informe o token JWT no campo de autenticação e confirme.

Após esse procedimento, o token será utilizado automaticamente nas requisições aos endpoints protegidos.

**Observação:** As credenciais abaixo são geradas automaticamente pela seed e destinadas exclusivamente à demonstração e aos testes locais.

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@raizes.com | 1234 |
| Gerente | gerente@raizes.com | 1234 |
| Atendente | atendente@raizes.com | 1234 |
| Cliente | cliente@raizes.com | 1234 |

### 6.2 - Testes no Insomnia ou Postman
Para testar a API nesses aplicativos, é necessário enviar o token JWT no cabeçalho HTTP (`Headers`) de cada requisição protegida.

Utilize o seguinte formato:

- **Key:** `Authorization`
- **Value:** `Bearer SEU_TOKEN_JWT`

Substitua `SEU_TOKEN_JWT` pelo token retornado após o login.

Na pasta Fluxo de Teste possue as rotas de teste ordenadas e é recomendável que cada rota seja usada na ordem

### 6.2 - Testes no Insomnia ou Postman

Para testar a API nesses aplicativos, é necessário enviar o token JWT no cabeçalho HTTP (`Headers`) de cada requisição protegida.

Utilize o seguinte formato:

- **Key:** `Authorization`
- **Value:** `Bearer SEU_TOKEN_JWT`

Substitua `SEU_TOKEN_JWT` pelo token retornado após realizar o login.

### 6.3 - Fluxo de Teste

A Coleção de testes está na raiz do projeto. Import o arquivo `insomniaTestes`.

Inicialmente, o fluxo apresenta a criação de uma conta de cliente, seguida pelo login e pela consulta das lojas e seus respectivos cardápios. Com essas informações, é possível criar um pedido e realizar o pagamento simulado.

Em seguida, deve ser realizado o login na conta genérica de administrador, criada automaticamente durante a execução da seed. Com o acesso de administrador, é possível criar uma conta de atendente vinculada à loja onde o pedido foi realizado. Após a criação, basta fazer login com as credenciais do atendente para continuar o fluxo.

A partir desse momento, as próximas operações são realizadas do ponto de vista do atendente. Ele poderá consultar os pedidos da loja à qual está vinculado e gerenciar aqueles que ainda estão pendentes de atendimento.

No cenário demonstrado, o pedido já estará com o pagamento aprovado. Dessa forma, o atendente poderá atualizar o campo `status_pedido`, alterando a situação do pedido conforme as opções permitidas pela API.

**01 - Criação de Conta Cliente:** Crie uma conta de cliente na API.

**02 - Login do Cliente:** Realize o login utilizando as credenciais escolhidas na etapa anterior. Salve o token JWT de login do cliente para ser utilizado nas próximas requisições.

**03 - Consulta de Lojas:** Consulte as lojas cadastradas e salve o ID de uma delas para consultar seu cardápio.

**04 - Consulta de Cardápio:** Consulte os produtos disponíveis no cardápio da loja escolhida colocando em loja_id na URL.

**05 - Criação de Pedido:** Envie o pedido utilizando o modelo de Body disponibilizado, preenchendo os dados necessários com o Id da loja escolhida anteriormente, e o id do produto junto a sua quantidade.

**06 - Consulta de Pedidos do Cliente:** Confirme que o pedido está criado consultando os pedidos vinculados a conta que está logada usando o cliente_id.

**07 - Realização do Pagamento:** Insira o ID do pagamento na URL e realize o pagamento simulado, enviando `"APROVADO"` no campo `resultado` do Body.

**08 - Login do Administrador:** Realize o login como administrador para obter o token JWT necessário para a criação da conta do atendente.

**09 - Criação de Conta Atendente:** Crie uma conta de atendente utilizando o modelo de Body disponibilizado. Altere apenas o campo `loja_id` para o ID da loja escolhida anteriormente.

**10 - Login do Atendente:** Realize o login com as credenciais da conta de atendente criada na etapa anterior e salve o token JWT para as próximas requisições.

**11 - Consulta de Pedidos da Loja:** Consulte os pedidos da loja vinculada ao atendente. É possível filtrar os pedidos pelo status desejado, como pendentes. Altere o campo `loja_id` para o ID da loja à qual o atendente está vinculado.

**12 - Atualização do Status do Pedido:** Após verificar que o pagamento do cliente foi aprovado, o atendente poderá atualizar o status do pedido para `"EM_PREPARO"`, `"EM_ROTA_ENTREGA"`, `"CANCELADO"` ou `"FINALIZADO"`, conforme as opções permitidas pela API.

**13 - Verificação da Atualização:** Consulte novamente os pedidos da loja para verificar se o status do pedido foi atualizado corretamente.









