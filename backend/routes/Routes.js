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


module.exports = router
