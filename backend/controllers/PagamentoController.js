const Pagamento = require('../models/Pagamento');
const Aluno = require('../models/aluno');
const { ContaBancaria } = require('../models/transicaoFinanceira');
const { TransacaoFinanceira } = require('../models/transicaoFinanceira');
const { Op } = require('sequelize');

const PagamentoController = {
  // Criar um novo pagamento
  async create(req, res) {
    try {
      console.log('Dados recebidos:', req.body);
      const { aluno_id, conta_id, mes_referencia, valor, observacao } = req.body;
      const recebido_por = req.body.recebido_por || 'Usuário não identificado';

      // Validar tipos de dados
      const errors = {};
      
      if (!aluno_id || isNaN(parseInt(aluno_id))) {
        errors.aluno_id = 'ID do aluno é inválido';
      }
      
      if (!conta_id || isNaN(parseInt(conta_id))) {
        errors.conta_id = 'ID da conta é inválido';
      }
      
      if (!mes_referencia || !Date.parse(mes_referencia)) {
        errors.mes_referencia = 'Mês de referência é inválido';
      }
      
      if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
        errors.valor = 'Valor deve ser um número maior que zero';
      }

      if (Object.keys(errors).length > 0) {
        console.log('Erros de validação:', errors);
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors
        });
      }

      // Converter valores para os tipos corretos
      const alunoId = parseInt(aluno_id);
      const contaId = parseInt(conta_id);
      const valorNumerico = parseFloat(valor);

      // Verificar se o aluno existe
      const aluno = await Aluno.findByPk(alunoId);
      if (!aluno) {
        console.log('Aluno não encontrado:', alunoId);
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      // Verificar se a conta existe
      const conta = await ContaBancaria.findByPk(contaId);
      if (!conta) {
        console.log('Conta não encontrada:', contaId);
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      // Verificar se já existe pagamento para este mês
      const pagamentoExistente = await Pagamento.findOne({
        where: {
          aluno_id: alunoId,
          mes_referencia: mes_referencia
        }
      });

      if (pagamentoExistente) {
        console.log('Pagamento já existe para este mês:', mes_referencia);
        return res.status(400).json({ 
          error: 'Já existe um pagamento registrado para este mês',
          details: {
            mes_referencia: 'Este mês já possui um pagamento registrado'
          }
        });
      }

      // Criar o pagamento
      const pagamento = await Pagamento.create({
        aluno_id: alunoId,
        conta_id: contaId,
        mes_referencia,
        valor: valorNumerico,
        recebido_por,
        observacao: observacao || ''
      });

      console.log('Pagamento criado:', pagamento.id);

      // Atualizar o saldo da conta
      const novoSaldo = parseFloat(conta.saldo_atual) + valorNumerico;
      await conta.update({
        saldo_atual: novoSaldo
      });

      // Criar uma transação financeira
      await TransacaoFinanceira.create({
        tipo: 'receita',
        valor: valorNumerico,
        descricao: `Mensalidade - ${aluno.nome} - ${new Date(mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - ${new Date().toLocaleTimeString('pt-BR')}`,
        categoria: 'mensalidade',
        data: new Date(),
        conta_id: contaId
      });

      return res.status(201).json(pagamento);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      console.error('Stack trace:', error.stack);
      
      // Verificar se é um erro de validação do Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        
        return res.status(400).json({
          error: 'Erro de validação',
          details: validationErrors
        });
      }

      return res.status(500).json({ 
        error: 'Erro ao criar pagamento',
        details: error.message
      });
    }
  },

  // Buscar pagamentos por aluno
  async getByAluno(req, res) {
    try {
      const { aluno_id } = req.params;
      console.log('Iniciando busca de pagamentos para aluno_id:', aluno_id);

      // Verificar se o aluno existe
      const aluno = await Aluno.findByPk(aluno_id);
      console.log('Busca do aluno:', aluno ? 'Encontrado' : 'Não encontrado');
      
      if (!aluno) {
        console.log('Aluno não encontrado:', aluno_id);
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      console.log('Buscando pagamentos...');
      const pagamentos = await Pagamento.findAll({
        where: { aluno_id },
        include: [
          { 
            model: Aluno, 
            attributes: ['nome'],
            required: true
          },
          { 
            model: ContaBancaria, 
            attributes: ['nome'],
            required: true
          }
        ],
        order: [['data_pagamento', 'DESC']]
      });
      console.log('Pagamentos encontrados:', pagamentos.length);

      // Verificar se há algum erro nas associações
      if (pagamentos.length > 0) {
        console.log('Primeiro pagamento:', {
          id: pagamentos[0].id,
          aluno: pagamentos[0].Aluno?.nome,
          conta: pagamentos[0].ContaBancaria?.nome
        });
      }

      // Calcular totais
      const totalPago = pagamentos.reduce((acc, pag) => acc + parseFloat(pag.valor), 0);
      const mesesPagos = pagamentos.length;

      return res.json({
        pagamentos,
        totalPago,
        mesesPagos
      });
    } catch (error) {
      console.error('Erro detalhado ao buscar pagamentos:', error);
      console.error('Stack trace:', error.stack);
      console.error('Mensagem de erro:', error.message);
      console.error('Nome do erro:', error.name);
      
      // Verificar se é um erro de conexão com o banco
      if (error.name === 'SequelizeConnectionError') {
        return res.status(500).json({ 
          error: 'Erro de conexão com o banco de dados',
          details: error.message 
        });
      }
      
      // Verificar se é um erro de tabela não encontrada
      if (error.name === 'SequelizeTableDoesNotExistError') {
        return res.status(500).json({ 
          error: 'Tabela não encontrada no banco de dados',
          details: error.message 
        });
      }

      return res.status(500).json({ 
        error: 'Erro ao buscar pagamentos',
        details: error.message,
        type: error.name
      });
    }
  },

  // Buscar pagamentos por período
  async getByPeriod(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: 'Data inicial e final são obrigatórias' });
      }

      const pagamentos = await Pagamento.findAll({
        where: {
          data_pagamento: {
            [Op.between]: [data_inicio, data_fim]
          }
        },
        include: [
          { model: Aluno, attributes: ['nome'] },
          { model: ContaBancaria, attributes: ['nome'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      return res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao buscar pagamentos por período:', error);
      return res.status(500).json({ error: 'Erro ao buscar pagamentos por período' });
    }
  },

  // Buscar todos os pagamentos
  async getAll(req, res) {
    try {
      const pagamentos = await Pagamento.findAll({
        include: [
          { model: Aluno, attributes: ['nome'] },
          { model: ContaBancaria, attributes: ['nome'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      return res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao buscar todos os pagamentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar todos os pagamentos' });
    }
  }
};

module.exports = PagamentoController; 