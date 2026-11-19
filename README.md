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

Criar, na raiz do projeto, um arquivo `.env` com base no `.env.example`.

Preencher as variáveis com as configurações do ambiente, como as credenciais do **MySQL** e a chave secreta que deseja utilizar no **JWT**.

O arquivo `.env` deve conter as configurações de conexão com o MySQL e a chave secreta utilizada na autenticação JWT. Consulte o arquivo `.env.example` para verificar as variáveis necessárias.

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

### 6.3 – Fluxo Testes

A coleção de testes da API está disponível na raiz do projeto, no arquivo `insomniaTestes`. Para executá-la, importe o arquivo no Insomnia.

Os testes foram organizados em **7 etapas**, com as requisições numeradas de T01 a T24. Para garantir o funcionamento correto do fluxo, recomenda-se executar as requisições na ordem apresentada.

A coleção utiliza recursos do Insomnia para automatizar o preenchimento de informações entre as requisições:

- **Token de autenticação:** após o login, um script salva automaticamente o token recebido. Ao realizar login em outra conta, o token anterior é substituído pelo novo.
- **Response Body Attribute:** utilizado nas requisições que dependem de informações retornadas por requisições anteriores, como o ID do pagamento e o ID do pedido.

#### Etapa 1 – Validação de Cadastro

**T01 – Cadastro de cliente com dados válidos**

- **Endpoint:** `POST /usuarios/cliente`
- **Pré-condição:** Não possuir uma conta cadastrada com o mesmo e-mail.
- **Entrada:** `{ nome, email, senha }`
- **Resultado esperado:** HTTP 201 – Mensagem de confirmação e informações do usuário (`id`, `nome`, `email` e `role`).
- **Evidência:** Cadastro de cliente com campos válidos.

**T02 – Cadastro de cliente sem campo obrigatório**

- **Endpoint:** `POST /usuarios/cliente`
- **Pré-condição:** Enviar o cadastro sem informar um dos campos obrigatórios.
- **Entrada:** `{ nome, email }`
- **Resultado esperado:** HTTP 400 – Mensagem de erro.
- **Evidência:** Cadastro sem campo obrigatório.

**T03 – Tentativa de criar conta de administrador sem autorização**

- **Endpoint:** `POST /usuarios/funcionario`
- **Pré-condição:** Tentar registrar uma conta de administrador sem possuir autorização.
- **Entrada:** `{ nome, email, senha, role }`
- **Resultado esperado:** HTTP 403 – Mensagem de erro.
- **Evidência:** Tentativa de criação de conta de administrador sem autorização.

#### Etapa 2 – Autenticação e Autorização

**T04 – Login com credenciais inválidas**

- **Endpoint:** `POST /auth/login`
- **Pré-condição:** Tentar acessar a conta de cliente utilizando credenciais incorretas.
- **Entrada:** `{ email, senha }`
- **Resultado esperado:** HTTP 400 – Mensagem de erro.
- **Evidência:** Login de cliente com credenciais inválidas.

**T05 – Login de cliente com credenciais válidas**

- **Endpoint:** `POST /auth/login`
- **Pré-condição:** Possuir uma conta de cliente cadastrada.
- **Entrada:** `{ email, senha }`
- **Resultado esperado:** HTTP 200 – Mensagem de confirmação, informações do usuário (`id`, `nome`, `role`) e token de acesso.
- **Evidência:** Login de cliente com credenciais válidas.

**T06 – Cliente tentando acessar rota exclusiva para administrador**

- **Endpoint:** `POST /lojas`
- **Pré-condição:** Estar autenticado como cliente e tentar cadastrar uma loja.
- **Entrada:** `{ nome, estado }`
- **Resultado esperado:** HTTP 401 – Mensagem de erro relacionada à autenticação.
- **Evidência:** Cliente tentando acessar a rota exclusiva para administrador.

**T07 – Tentativa de acessar rota de cardápio sem token**

- **Endpoint:** `GET /cardapios?page=1&limit=10&loja_id=1`
- **Pré-condição:** Não estar autenticado em nenhuma conta.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 401 – Mensagem de erro informando que o token não foi enviado.
- **Evidência:** Tentativa de acessar rota de cardápio sem token.

#### Etapa 3 – Consulta de Lojas, Cardápios e Criação de Pedidos

**T08 – Consultar lojas cadastradas**

- **Endpoint:** `GET /lojas`
- **Pré-condição:** Estar autenticado em qualquer conta.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Lista de lojas cadastradas, contendo `id`, `nome` e `estado`.
- **Evidência:** Consulta de lojas.

**T09 – Consultar cardápio de uma loja**

- **Endpoint:** `GET /cardapios?page=1&limit=10&loja_id=1`
- **Pré-condição:** A loja consultada deve estar cadastrada.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Lista de produtos associados ao cardápio, contendo informações como `id`, `produto_id`, `receita`, `loja_id`, `estado`, `data_inicio`, `data_fim` e `disponibilidade`.
- **Evidência:** Consulta do cardápio da loja 1.

**T10 – Tentativa de realizar pedido com produto fora do período de vendas**

- **Endpoint:** `POST /pedidos`
- **Pré-condição:** Tentar realizar um pedido utilizando um produto indisponível devido ao seu período de vendas.
- **Entrada:** `{ loja_id, canal_pedido, metodo_pagamento, usar_pontos, itens: [{ produto_id, quantidade }] }`
- **Resultado esperado:** HTTP 409 – Mensagem de erro.
- **Evidência:** Tentativa de realizar pedido com produto fora do período de vendas.

**T11 – Tentativa de realizar pedido com produto que não pertence ao cardápio da loja**

- **Endpoint:** `POST /pedidos`
- **Pré-condição:** Tentar realizar um pedido utilizando um produto que não está associado ao cardápio da loja selecionada.
- **Entrada:** `{ loja_id, canal_pedido, metodo_pagamento, usar_pontos, itens: [{ produto_id, quantidade }] }`
- **Resultado esperado:** HTTP 409 – Mensagem de erro.
- **Evidência:** Tentativa de realizar pedido com produto que não vende na loja.

**T12 – Criar pedido com dados válidos**

- **Endpoint:** `POST /pedidos`
- **Pré-condição:** Estar autenticado como cliente e possuir produtos disponíveis no cardápio da loja.
- **Entrada:** `{ loja_id, canal_pedido, metodo_pagamento, usar_pontos, itens: [{ produto_id, quantidade }] }`
- **Resultado esperado:** HTTP 201 – Mensagem de confirmação da criação do pedido.
- **Evidência:** Realização de pedido.

**T13 – Consultar todos os pedidos associados ao cliente**

- **Endpoint:** `GET /pedidos?cliente_id=4`
- **Pré-condição:** Possuir pedidos registrados na conta do cliente.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Lista de pedidos associados ao cliente.
- **Evidência:** Consulta de todos os pedidos do cliente.

**T14 – Consultar pedidos pendentes do cliente**

- **Endpoint:** `GET /pedidos?cliente_id=4&status_pedido=PENDENTE`
- **Pré-condição:** Possuir um pedido pendente registrado.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Lista de pedidos pendentes associados ao cliente.
- **Evidência:** Consulta dos pedidos pendentes do cliente.

#### Etapa 4 – Realização de Pagamento Recusado

**T15 – Processar pagamento com resultado recusado**

- **Endpoint:** `PATCH /pagamentos/{pagamento_id}/mock`
- **Pré-condição:** Estar autenticado como o cliente responsável pelo pedido pendente.
- **Entrada:** `{ resultado: "RECUSADO" }`
- **Resultado esperado:** HTTP 200 – Mensagem informando que o pagamento foi recusado.
- **Evidência:** Processamento de pagamento MOCK recusado.

#### Etapa 5 – Tentativa de Atualizar Pedido com Pagamento Recusado

**T16 – Login do atendente responsável pela loja**

- **Endpoint:** `POST /auth/login`
- **Pré-condição:** Possuir uma conta de atendente associada à mesma loja em que o pedido foi realizado.
- **Entrada:** `{ email, senha }`
- **Resultado esperado:** HTTP 200 – Mensagem de confirmação, informações do usuário (`id`, `nome`, `role`, `loja`) e token de acesso.
- **Evidência:** Login do atendente responsável pelo pedido recusado.

**T17 – Consultar pedidos pendentes da loja**

- **Endpoint:** `GET /pedidos?page=1&limit=10&loja_id=1&status_pedido=PENDENTE`
- **Pré-condição:** Estar autenticado como atendente associado à loja consultada.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Informações dos pedidos, incluindo `id`, `cliente_id`, `loja_id`, `canal_pedido`, `status_pedido`, `valor_total`, `data_pedido` e `status_pagamento`.
- **Evidência:** Consulta dos pedidos pendentes da loja de atuação.

**T18 – Atendente tentando atualizar pedido com pagamento recusado**

- **Endpoint:** `PUT /pedidos/{pedido_id}`
- **Pré-condição:** Estar autenticado como atendente da mesma loja do pedido, cujo pagamento foi recusado.
- **Entrada:** `{ status_pedido: "FINALIZADO" }`
- **Resultado esperado:** HTTP 409 – Mensagem de erro informando que a alteração não é permitida.
- **Evidência:** Tentativa de alterar o status de um pedido com pagamento recusado.

#### Etapa 6 – Realização de Pagamento Aprovado

**T19 – Login de cliente para processar pagamento aprovado**

- **Endpoint:** `POST /auth/login`
- **Pré-condição:** Possuir uma conta de cliente cadastrada.
- **Entrada:** `{ email, senha }`
- **Resultado esperado:** HTTP 200 – Mensagem de confirmação, informações do usuário (`id`, `nome`, `role`) e token de acesso.
- **Evidência:** Login de cliente.

**T20 – Processar pagamento com resultado aprovado**

- **Endpoint:** `PATCH /pagamentos/{pagamento_id}/mock`
- **Pré-condição:** Estar autenticado como o cliente responsável pelo pedido pendente.
- **Entrada:** `{ resultado: "APROVADO" }`
- **Resultado esperado:** HTTP 200 – Mensagem informando que o pagamento foi aprovado.
- **Evidência:** Processamento de pagamento MOCK aprovado.

#### Etapa 7 – Atualização de Pedido com Pagamento Aprovado

**T21 – Login do atendente responsável pela loja**

- **Endpoint:** `POST /auth/login`
- **Pré-condição:** Possuir uma conta de atendente associada à mesma loja em que o pedido foi realizado.
- **Entrada:** `{ email, senha }`
- **Resultado esperado:** HTTP 200 – Mensagem de confirmação, informações do usuário (`id`, `nome`, `role`, `loja`) e token de acesso.
- **Evidência:** Login do atendente responsável pelo pedido aprovado.

**T22 – Consultar pedidos pendentes da loja**

- **Endpoint:** `GET /pedidos?page=1&limit=10&loja_id=1&status_pedido=PENDENTE`
- **Pré-condição:** Estar autenticado como atendente associado à loja consultada.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Informações dos pedidos, incluindo `id`, `cliente_id`, `loja_id`, `canal_pedido`, `status_pedido`, `valor_total`, `data_pedido` e `status_pagamento`.
- **Evidência:** Consulta dos pedidos pendentes da loja de atuação.

**T23 – Atendente atualizando pedido com pagamento aprovado**

- **Endpoint:** `PUT /pedidos/{pedido_id}`
- **Pré-condição:** Estar autenticado como atendente da mesma loja do pedido, cujo pagamento foi aprovado.
- **Entrada:** `{ status_pedido: "FINALIZADO" }`
- **Resultado esperado:** HTTP 200 – Mensagem de confirmação da atualização do pedido.
- **Evidência:** Atendente alterando o status de um pedido com pagamento aprovado.

**T24 – Consultar pedidos finalizados da loja**

- **Endpoint:** `GET /pedidos?page=1&limit=10&loja_id=1&status_pedido=FINALIZADO`
- **Pré-condição:** Estar autenticado como atendente associado à loja consultada e possuir um pedido finalizado.
- **Entrada:** Nenhuma.
- **Resultado esperado:** HTTP 200 – Informações dos pedidos finalizados, incluindo `id`, `cliente_id`, `loja_id`, `canal_pedido`, `status_pedido`, `valor_total`, `data_pedido` e `status_pagamento`.
- **Evidência:** Consulta dos pedidos finalizados na loja de atuação.

