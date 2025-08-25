const corsMiddleware = (req, res, next) => {
  // Permitir todas as origens para debug
  res.header('Access-Control-Allow-Origin', '*');
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
