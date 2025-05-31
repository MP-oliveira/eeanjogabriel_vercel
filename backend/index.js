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
  'https://front-eeanjogabriel-vercel-gamma.vercel.app',
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
