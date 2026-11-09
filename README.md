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

A execução da seed cadastra automaticamente os dados iniciais do sistema, incluindo lojas, produtos, cardápios e contas de demonstração para cada perfil de usuário.

As credenciais das contas geradas estão disponíveis na seção **6.1 - Autenticação**.


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

### 6.2 - Autenticação em clientes externos

Caso utilize ferramentas como Insomnia ou Postman para testar a API, é necessário enviar o token JWT no cabeçalho HTTP (`Headers`) de cada requisição protegida.

Utilize o seguinte formato:

- **Key:** `Authorization`
- **Value:** `Bearer SEU_TOKEN_JWT`

Substitua `SEU_TOKEN_JWT` pelo token retornado durante o login.






