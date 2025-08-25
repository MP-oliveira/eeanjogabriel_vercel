const corsMiddleware = (req, res, next) => {
  // Lista de origens permitidas
  const allowedOrigins = [
    'https://eeanjogabriel.vercel.app',
    'https://frontend-five-silk-40.vercel.app',
    'https://frontend-owgak21pk-mauricio-silva-oliveiras-projects.vercel.app',
    'https://front-eeanjogabriel-vercel-gamma.vercel.app',
    'https://eeag.vercel.app',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  
  // Verificar se a origem está na lista de origens permitidas
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Para desenvolvimento, permitir localhost
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  // Log para debug
  console.log('CORS Middleware - Origin:', req.headers.origin);
  console.log('CORS Middleware - Method:', req.method);
  console.log('CORS Middleware - Path:', req.path);

  // Se for uma requisição OPTIONS (preflight), responde imediatamente
  if (req.method === 'OPTIONS') {
    console.log('CORS Middleware - Handling OPTIONS request');
    return res.status(204).end();
  }

  next();
};

module.exports = corsMiddleware;
