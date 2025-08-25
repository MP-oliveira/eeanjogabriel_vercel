const router = require('express').Router();
const authController = require('../controllers/AuthController')

// Middleware específico para CORS nas rotas de autenticação
router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/esqueciasenha', authController.esqueciASenha)
 

module.exports = router;