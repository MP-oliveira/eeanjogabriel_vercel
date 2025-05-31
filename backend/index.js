require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');
const db = require("./db/db");

// Inicialização do Express
const app = express();
const port = process.env.PORT || 3001;

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

// =============================================
// CONFIGURAÇÃO COMPLETA DE CORS
// =============================================

const allowedOrigins = [
  'https://front-eeanjogabriel-vercel.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origem não permitida no cors!"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["X-Requested-With", "Content-Type", "Accept"],
  credentials: true,
  
};

// Middleware para servir arquivos estáticos apenas em desenvolvimento
// if (process.env.NODE_ENV !== 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));
// }

// =============================================
// MIDDLEWARES ESSENCIAIS
// =============================================

// CORS primeiro
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// ROTAS DA APLICAÇÃO
// =============================================

// Health Check
// app.get('/api/health', (req, res) => {
//   try {
//     res.json({
//       status: 'healthy',
//       timestamp: new Date().toISOString(),
//       environment: process.env.NODE_ENV || 'development',
//       allowedOrigins,
//       database: db.authenticate ? 'connected' : 'disconnected'
//     });
//   } catch (error) {
//     console.error('[HEALTH CHECK ERROR]', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Erro ao verificar saúde do servidor',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// Rotas de Autenticação



// Middleware para testar a conexão com o banco antes de usar as rotas
const dbMiddleware = async (req, res, next) => {
  try {
    console.log("Tentando autenticar com o banco")
    await db.authenticate();
    console.log("Conectado com o banco")
    next();
  } catch (error) {
    console.error("Erro na conexão com o banco:", error);
    res.status(500).json({ error: "Erro na conexão com o banco de dados" });
  }
};

const routes = require('./routes/Routes.js');
app.use('/api', dbMiddleware, routes);

// Demais rotas da aplicação
// const routes = [
//   { path: '/api/auth', router: require('./routes/authRoutes') },
//   { path: '/api/admins', router: require('./routes/adminRoutes') },
//   { path: '/api/alunos', router: require('./routes/alunoRoutes') },
//   { path: '/api/cursos', router: require('./routes/cursoRoutes') },
//   { path: '/api/disciplinas', router: require('./routes/disciplinaRoutes') },
//   { path: '/api/diplomas', router: require('./routes/diplomaRoutes') },
//   { path: '/api/professores', router: require('./routes/professorRoutes') },
//   { path: '/api/materialeutensilios', router: require('./routes/materialEUtensilio') },
//   { path: '/api/turnos', router: require('./routes/turnoRoutes') },
//   { path: '/api/registroacademico', router: require('./routes/registroAcademicoRoutes') },
//   { path: '/api/financeiro', router: require('./routes/transacaoFinanceiraRoutes') },
//   { path: '/api/pagamentos', router: require('./routes/pagamentoRoutes') },
//   { path: '/api/contas', router: require('./routes/contaRoutes') }
// ];

// routes.forEach(route => {
//   try {
//     app.use(route.path, route.router);
//     console.log(`[ROTA] ${route.path} carregada com sucesso`);
//   } catch (err) {
//     console.error(`[ERRO] Falha ao carregar rota ${route.path}:`, err);
//     app.use(route.path, (req, res) => {
//       res.status(503).json({
//         error: 'Serviço temporariamente indisponível',
//         route: route.path,
//         message: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente mais tarde'
//       });
//     });
//   }
// });

// =============================================
// TRATAMENTO DE ERROS GLOBAL
// =============================================

app.use((err, req, res, next) => {
  console.error('[ERRO GLOBAL]', {
    error: err.stack,
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado',
    requestId: req.id
  });
});

// // Rota para 404 (não encontrado)
// app.use('*', (req, res) => {
//   // Se a requisição for para uma rota da API, retorna 404
//   if (req.path.startsWith('/api')) {
//     return res.status(404).json({
//       error: 'Endpoint não encontrado',
//       availableEndpoints: routes.map(r => r.path),
//       method: req.method,
//       path: req.originalUrl
//     });
//   }
  
//   // Em produção, retorna uma mensagem mais amigável
//   if (process.env.NODE_ENV === 'production') {
//     return res.status(404).json({
//       error: 'Endpoint não encontrado',
//       message: 'Este é um servidor de API. Por favor, verifique a URL da API.',
//       documentation: 'Consulte a documentação da API para endpoints disponíveis.'
//     });
//   }
  
//   // Em desenvolvimento, serve o index.html do frontend
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// =============================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================

// const startServer = async () => {
//   try {
//     // Testar conexão com o banco de dados
//     await db.authenticate();
//     console.log('[DATABASE] Conexão estabelecida com sucesso');
    
//     // Sincronizar modelos (com segurança para produção)
//     if (process.env.NODE_ENV !== 'production') {
//       await db.sync({ alter: true });
//       console.log('[DATABASE] Modelos sincronizados');
//     }

//     // Iniciar servidor apenas em ambiente local
//     if (require.main === module) {
//       app.listen(port, () => {
//         console.log(`[SERVER] Servidor rodando na porta ${port}`);
//         console.log(`[ENV] Ambiente: ${process.env.NODE_ENV || 'development'}`);
//         console.log(`[CORS] Origins permitidas: ${allowedOrigins.join(', ')}`);
//       });
//     }
//   } catch (error) {
//     console.error('[FALHA CRÍTICA]', error);
//     process.exit(1);
//   }
// };

// startServer();

// Se estiver rodando localmente
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
}

// Exportação para Vercel
module.exports = app;
