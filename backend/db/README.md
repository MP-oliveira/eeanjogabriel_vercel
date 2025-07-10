# Gerenciamento do Banco de Dados

Este diretório contém os arquivos para gerenciar a sincronização do banco de dados.

## Pré-requisitos

Antes de usar os scripts, você precisa configurar as variáveis de ambiente:

### 1. Criar arquivo .env
Crie um arquivo `.env` no diretório `backend` com:

```bash
# Para banco local PostgreSQL
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco

# OU para Supabase
SUPABASE_URL=sua_url_supabase
SUPABASE_KEY=sua_chave_supabase

# Configurações do servidor
PORT=3001
NODE_ENV=development
```

### 2. Instalar dependências
```bash
cd backend
npm install
```

## Arquivos

- `db.js` - Configuração da conexão com o banco de dados
- `init.js` - Script de inicialização e sincronização do banco
- `README.md` - Este arquivo

## Como usar

### 1. Sincronizar o banco (sem apagar dados)

```bash
npm run db:sync
```

ou

```bash
node db/init.js
```

### 2. Zerar o banco de dados (APAGA TODOS OS DADOS!)

```bash
npm run db:reset
```

ou

```bash
node db/init.js --force
```

### 3. Usar programaticamente

```javascript
const { syncDatabase, resetDatabase } = require('./db/init');

// Sincronizar sem apagar dados
await syncDatabase();

// Zerar o banco (CUIDADO!)
await resetDatabase();
```

## ⚠️ ATENÇÃO

- O comando `--force` ou `db:reset` **APAGA TODOS OS DADOS** do banco
- Use apenas em ambiente de desenvolvimento
- Faça backup antes de usar em produção
- Confirme que você realmente quer apagar todos os dados

## O que acontece

1. **Sincronização normal**: Cria as tabelas se não existirem, mantém dados existentes
2. **Sincronização com force**: Apaga todas as tabelas e recria do zero

## Modelos incluídos

- Admin
- Aluno
- Curso
- Disciplina
- Professor
- RegistroAcademico
- Diploma
- MaterialEUtensilio
- Pagamento
- TransacaoFinanceira
- ContaBancaria
- Turno
- Login

## Troubleshooting

### Erro: "ConnectionRefusedError"
- **Causa**: Não consegue conectar ao banco de dados
- **Soluções**:
  1. Verifique se o arquivo `.env` existe e está configurado
  2. Verifique se o banco de dados está rodando
  3. Verifique se a URL do banco está correta
  4. Verifique se as credenciais estão corretas

### Erro: "Variáveis de ambiente não configuradas"
- **Causa**: Arquivo `.env` não existe ou não tem as variáveis necessárias
- **Solução**: Crie o arquivo `.env` com as configurações do banco

### Erro: "Permission denied"
- **Causa**: Sem permissão para acessar o banco
- **Solução**: Verifique as credenciais no arquivo `.env` 