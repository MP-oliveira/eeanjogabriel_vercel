require('dotenv').config();
const db = require('./db');

// Importar todos os modelos
const Admin = require('../models/admin');
const Aluno = require('../models/aluno');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Professor = require('../models/professor');
const RegistroAcademico = require('../models/registroAcademico');
const Diploma = require('../models/diploma');
const MaterialEUtensilio = require('../models/materialEUtensilio');
const Pagamento = require('../models/Pagamento');
// Usando apenas o modelo transicaoFinanceira para evitar conflitos
const { TransacaoFinanceira, ContaBancaria } = require('../models/transicaoFinanceira');
// const { Financial, BankAccount, Bill } = require('../models/financial'); // Comentado para evitar conflitos
const Turno = require('../models/turno');
const Login = require('../models/login');

// Função para sincronizar o banco de dados
async function syncDatabase(force = false) {
  try {
    console.log('🔄 Iniciando sincronização do banco de dados...');
    
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
      console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
      console.error('📝 Crie um arquivo .env no diretório backend com:');
      console.error('   DATABASE_URL=sua_url_do_banco');
      console.error('   ou');
      console.error('   SUPABASE_URL=sua_url_supabase');
      console.error('   SUPABASE_KEY=sua_chave_supabase');
      process.exit(1);
    }
    
    // Testar conexão
    console.log('🔗 Testando conexão com o banco...');
    await db.authenticate();
    console.log('✅ Conexão com o banco estabelecida');
    
    // Sincronizar todos os modelos
    console.log('🔄 Sincronizando modelos...');
    await db.sync({ force });
    
    if (force) {
      console.log('🗑️  Banco de dados zerado com sucesso!');
    } else {
      console.log('✅ Banco de dados sincronizado com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Possíveis soluções:');
      console.error('   1. Verifique se o banco de dados está rodando');
      console.error('   2. Verifique se a URL do banco está correta no .env');
      console.error('   3. Verifique se as credenciais estão corretas');
    }
    
    throw error;
  }
}

// Função para zerar o banco (force = true)
async function resetDatabase() {
  return syncDatabase(true);
}

// Função para sincronizar sem zerar (force = false)
async function syncDatabaseSafe() {
  return syncDatabase(false);
}

module.exports = {
  syncDatabase,
  resetDatabase,
  syncDatabaseSafe
};

// Se este arquivo for executado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--force') || args.includes('-f')) {
    console.log('⚠️  ATENÇÃO: Isso irá APAGAR todos os dados do banco!');
    resetDatabase()
      .then(() => {
        console.log('✅ Banco zerado com sucesso!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Erro ao zerar banco:', error);
        process.exit(1);
      });
  } else {
    syncDatabaseSafe()
      .then(() => {
        console.log('✅ Banco sincronizado com sucesso!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Erro ao sincronizar banco:', error);
        process.exit(1);
      });
  }
} 