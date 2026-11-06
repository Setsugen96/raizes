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
- Cliente MySQL para executar o script do banco de dados.

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

### 4.4 - Configurar o banco de dados

Inicie o servidor MySQL e crie o banco de dados:

```sql
CREATE DATABASE db_raizes_do_nordeste;
```

Selecione o banco criado e execute o arquivo `database/schema.sql` no MySQL Workbench ou em outro cliente MySQL.

Execute o comando para inserir os dados iniciais:

```bash
npm run seed
```

A seed utiliza as configurações do arquivo `.env` para inserir os dados iniciais no banco.

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

A execução da seed cadastra lojas, produtos, cardápios e um usuário administrador inicial.

Com esse usuário administrador, é possível gerenciar funcionários, lojas, produtos e cardápios.

As credenciais do administrador devem ser configuradas pelas variáveis `SEED_ADMIN_*` no arquivo `.env`.