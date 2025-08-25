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
// CONFIGURAÇÃO SIMPLIFICADA DE CORS
// =============================================

const corsOptions = {
  origin: [
    'https://eeanjogabriel.vercel.app',
    'https://frontend-five-silk-40.vercel.app',
    'https://frontend-owgak21pk-mauricio-silva-oliveiras-projects.vercel.app',
    'https://front-eeanjogabriel-vercel-gamma.vercel.app',
    'https://eeag.vercel.app',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "X-Requested-With", 
    "Content-Type", 
    "Accept", 
    "Authorization",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  credentials: true,
  optionsSuccessStatus: 204
};


// CORS primeiro
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


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

// Rota de teste para CORS
app.get('/api/test-cors', (req, res) => {
  console.log('Teste CORS - Origin:', req.headers.origin);
  console.log('Teste CORS - Method:', req.method);
  console.log('Teste CORS - Headers:', req.headers);
  
  res.json({ 
    message: 'CORS está funcionando!',
    origin: req.headers.origin,
    method: req.method,
    corsHeaders: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    },
    timestamp: new Date().toISOString()
  });
});

// Rota de teste para login (sem autenticação)
app.post('/api/test-login', (req, res) => {
  console.log('Teste de login recebido:', req.body);
  res.json({ 
    message: 'Teste de login funcionando!',
    body: req.body,
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const routes = require('./routes/Routes.js');
app.use('/api', dbMiddleware, routes);


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


// Se estiver rodando localmente
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
}

// Exportação para Vercel
module.exports = app;
