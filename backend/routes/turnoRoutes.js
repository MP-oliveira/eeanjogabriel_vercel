const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/TurnosController');


router.post('/create', turnoController.createTurno);

router.get('/', turnoController.listTurnos);

router.get('/:id', turnoController.getTurnoById);

router.delete('/:id', turnoController.deleteTurno);


module.exports = router;
