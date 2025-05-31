const router = require('express').Router();
const db = require("../db/db.js");
const auth = require('./authRoutes.js')
const admins = require("./adminRoutes.js")
const alunos = require("./alunoRoutes.js")
const cursos = require("./cursoRoutes.js")
const disciplinas = require("./disciplinaRoutes.js")
const diplomas = require("./diplomaRoutes.js")
const professores = require("./professorRoutes.js")
const materialEUtensilios = require("./materialEUtensilio.js")
const turnos = require("./turnoRoutes.js")
const registroAcademico = require("./registroAcademicoRoutes.js")
const financeiro = require("./transacaoFinanceiraRoutes.js")
const pagamentos = require("./pagamentoRoutes.js")
const contas = require("./contaRoutes.js")



// Rota de teste para verificar se o servidor está funcionando
router.get("/", (req, res) => {
    res.json({ message: "Backend funcionando!" });
  });

router.use("/auth", auth)  
router.use("/admins", admins)  
router.use("/alunos", alunos)  

router.use("/cursos", cursos)  
router.use("/disciplinas", disciplinas)  
router.use("/professores", professores)  
router.use("/diplomas", diplomas)  
router.use("/materialeutensilios", materialEUtensilios)  
router.use("/turnos", turnos)  
router.use("/registroacademico", registroAcademico)  
router.use("/financeiro", financeiro)  
router.use("/pagamentos", pagamentos)  
router.use("/contas", contas)  

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

module.exports = router
