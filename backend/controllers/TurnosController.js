const Turno = require("../models/turno");
const { Op } = require('sequelize');

module.exports = class TurnosController {
  static async listTurnos(req, res) {
    try {
      const turnos = await Turno.findAll();
      res.status(200).json(turnos);
    } catch (error) {
      console.error('Erro ao buscar turnos:', error);
      res.status(500).json({ erro: 'Erro ao buscar turnos' });
    }
  }

  static async getTurnoByName(req, res) {
    const { nome } = req.query;
    
    console.log(`Nome recebido: ${nome}`);

    try {
      const turnos = await Turno.findAll({
        where: { nome: { [Op.like]: `%${nome}%` } },
      });
  
      console.log(`Turnos encontrados: ${JSON.stringify(turnos)}`);
  
      if (turnos.length === 0) {
        return res.status(404).json({ error: 'Turno não encontrado' });
      }
  
      res.status(200).json(turnos);
    } catch (error) {
      console.error('Erro ao buscar turno:', error);
      res.status(500).json({ error: 'Erro ao buscar turno' });
    }
  }

  static async createTurno(req, res) {
    const { nome, inicio, termino } = req.body;

    // Validação simples
    if (!nome || !inicio || !termino) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const createdTurno = await Turno.create({ nome, inicio, termino });
      res.status(201).json(createdTurno);
    } catch (error) {
      console.error('Erro ao criar turno:', error);
      res.status(500).json({ error: 'Erro ao criar turno', details: error.message });
    }
  }

  static async getTurnoById(req, res) {
    const { id } = req.params;
    
    try {
      const turno = await Turno.findByPk(id);
      if (!turno) {
        return res.status(404).json({ error: 'Turno não encontrado' });
      }
      res.status(200).json(turno);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar turno' });
    }
  }

  static async updateTurno(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    
    try {
      const turno = await Turno.findByPk(id);
      if (!turno) {
        return res.status(404).json({ error: 'Turno não encontrado' });
      }

      await turno.update(updatedData);
      res.status(200).json({ message: 'Turno atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar turno' });
    }
  }

  static async deleteTurno(req, res) {
    const { id } = req.params;

    try {
      const turno = await Turno.findByPk(id);
      if (!turno) {
        return res.status(404).json({ error: 'Turno não encontrado' });
      }

      await turno.destroy();
      res.status(200).json({ message: 'Turno deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar turno' });
    }
  }
};