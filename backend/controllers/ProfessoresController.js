const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

const Professor = require("../models/professor");
const Disciplina = require("../models/disciplina");
const bcrypt = require("bcrypt");

// Função para criar um usuário no Supabase Auth
async function createSupabaseUser(nome, email, password, role) {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: nome,
          role // Definir o papel do usuário (aluno, professor ou admin)
        }
      }
    });

    if (error) {
      console.error('Erro ao criar usuário:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return null;
  }
}

module.exports = class ProfessoresController {

  static async listProfessores(req, res) {
    try {
      const professores = await Professor.findAll({
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          through: { attributes: [] }
        }]
      });
      res.status(200).json(professores);
    } catch (error) {
      console.error('Erro ao listar professores:', error);
      res.status(500).json({ error: 'Erro ao listar professores' });
    }
  }

  static async createProfessor(req, res) {
    const {
      nome,
      especialidade,
      email,
      telefone,
      status,
      role,
      password,
      disciplinasIds
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const professorExists = await Professor.findOne({
        where: { email: email },
      });

      if (professorExists) {
        return res.status(400).json({ error: 'Professor já cadastrado com este email' });
      }

      const professor = {
        nome,
        especialidade,
        email,
        telefone,
        status,
        role,
        password: hashedPassword
      };

      // Converter para minúsculas com exceções
      const professorLowercase = Object.fromEntries(
        Object.entries(professor).map(([key, value]) => [
          key,
          typeof value === "string" &&
            key !== "nome" &&
            key !== "password"
            ? value.toLowerCase()
            : value,
        ])
      );
      console.log("Dados do professor antes de criar:", {
        ...professorLowercase,
        password: professorLowercase.password ? "exists" : "missing"
      });

      const createdProfessor = await Professor.create(professorLowercase);
      console.log('professor depois do create', createdProfessor)
      await createSupabaseUser(professorLowercase.nome, professorLowercase.email, password, 'professor');
      
      if (disciplinasIds && disciplinasIds.length > 0) {
        const disciplinas = await Disciplina.findAll({
          where: {
            id: disciplinasIds
          }
        });
        await createdProfessor.setDisciplinas(disciplinas);
      }

      const newProfessor = await Professor.findOne({
        where: { id: createdProfessor.id },
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          through: { attributes: [] }
        }]
      });

      res.status(201).json(newProfessor);
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      res.status(500).json({ error: 'Erro ao criar professor' });
    }
  }

  static async getProfessorById(req, res) {
    const { id } = req.params;

    try {
      const professor = await Professor.findOne({
        where: { id: id },
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          through: { attributes: [] }
        }]
      });

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.status(200).json(professor);
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      res.status(500).json({ error: 'Erro ao buscar professor' });
    }
  }

  static async updateProfessor(req, res) {
    const { id } = req.params;
    const {
      nome,
      especialidade,
      email,
      telefone,
      status,
      role,
      password,
      disciplinasIds
    } = req.body;

    try {
      const professor = await Professor.findByPk(id);
      
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      // Verifica se o novo email já está em uso por outro professor
      if (email && email !== professor.email) {
        const emailExists = await Professor.findOne({
          where: { email: email }
        });
        if (emailExists) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
      }

      // Se uma nova senha foi fornecida, hash ela
      let updateData = {
        nome,
        especialidade,
        email,
        telefone,
        status,
        role
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;

        // Atualizar senha no Supabase
        const { error: supabaseError } = await supabase.auth.admin.updateUserById(
          professor.id,
          { password: password }
        );

        if (supabaseError) {
          console.error("Erro ao atualizar senha no Supabase:", supabaseError);
          return res.status(500).json({ error: "Erro ao atualizar senha no Supabase" });
        }
      }

      await professor.update(updateData);

      if (disciplinasIds) {
        const disciplinas = await Disciplina.findAll({
          where: {
            id: disciplinasIds
          }
        });
        await professor.setDisciplinas(disciplinas);
      }

      const updatedProfessor = await Professor.findOne({
        where: { id: id },
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          through: { attributes: [] }
        }]
      });

      res.status(200).json(updatedProfessor);
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      res.status(500).json({ error: 'Erro ao atualizar professor' });
    }
  }

  static async deleteProfessor(req, res) {
    const { id } = req.params;

    try {
      const professor = await Professor.findByPk(id);
      
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      await professor.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      res.status(500).json({ error: 'Erro ao deletar professor' });
    }
  }
};
