
const Admin = require("../models/admin.js");
const supabase = require("../db/supabaseCilent");

// Função para criar um usuário no Supabase Auth
async function createSupabaseUser(nome, email, password, role) {
  try {
    console.log('Criando usuário no Supabase Auth:');
    console.log('Email:', email);
    console.log('Senha para Supabase (primeiros 3 chars):', password ? password.substring(0, 3) + "..." : "null");
    console.log('Tamanho da senha para Supabase:', password ? password.length : 0);
    
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: nome,
          role, // Definir o papel do usuário (aluno, admin ou admin)
        },
      },
    });

    if (error) {
      console.error("Erro ao criar usuário:", error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return null;
  }
}

module.exports = class AdminsController {
  static async listAdmins(req, res) {
    try {
      const admins = await Admin.findAll();
      res.status(200).json(admins);
    } catch (error) {
      console.error("Erro ao listar admins:", error);
      res.status(500).json({ error: "Erro ao listar admins" });
    }
  }

  static async createAdmin(req, res) {
    const {
      nome,
      email,
      telefone,
      role,
      password
    } = req.body;

    // Log para debug
    console.log('Dados recebidos no createAdmin:');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Telefone:', telefone);
    console.log('Role:', role);
    console.log('Password:', password ? '***' : 'null');
    console.log('Body completo:', req.body);

    try {
      const adminExists = await Admin.findOne({
        where: { email: email },
      });

      if (adminExists) {
        return res
          .status(400)
          .json({ error: "Admin já cadastrado com este email" });
      }

      const admin = {
        nome,
        email,
        telefone,
        role,
        password,
      };

      console.log('Objeto admin antes do lowercase:', admin);

      // Converter para minúsculas com exceções (não converter senha)
      const adminLowercase = Object.fromEntries(
        Object.entries(admin).map(([key, value]) => [
          key,
          typeof value === "string" &&
            key !== "nome" &&
            key !== "password"
            ? value.toLowerCase()
            : value,
        ])
      );
      
      console.log('Objeto admin depois do lowercase:', adminLowercase);
      
      // Salvar a senha original antes de criar o admin (que vai hashear)
      const senhaOriginal = adminLowercase.password;
      
      console.log('Senha original recebida:', senhaOriginal);
      console.log('Tamanho da senha original:', senhaOriginal ? senhaOriginal.length : 0);
      console.log(adminLowercase, 'antes do await');

      const createdAdmin = await Admin.create(adminLowercase);
      console.log('Admin criado:', createdAdmin);
      console.log('depois do create', createdAdmin)
      
      // Usar a senha original para o Supabase Auth
      await createSupabaseUser(adminLowercase.nome, adminLowercase.email, senhaOriginal, "admin");

      const newAdmin = await Admin.findOne({
        where: { id: createdAdmin.id }
      });

      console.log('Admin final retornado:', newAdmin);

      res.status(201).json(newAdmin);
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      res.status(500).json({ error: "Erro ao criar admin" });
    }
  }

  static async getAdminById(req, res) {
    const { id } = req.params;

    try {
      const admin = await Admin.findOne({
        where: { id: id },
      });

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      res.status(200).json(admin);
    } catch (error) {
      console.error("Erro ao buscar admin:", error);
      res.status(500).json({ error: "Erro ao buscar admin" });
    }
  }

  static async updateAdmin(req, res) {
    const { id } = req.params;
    const {
      nome,
      email,
      telefone,
      role,
      password
    } = req.body;

    try {
      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      // Verifica se o novo email já está em uso por outro admin
      if (email && email !== admin.email) {
        const emailExists = await Admin.findOne({
          where: { email: email },
        });
        if (emailExists) {
          return res.status(400).json({ error: "Email já está em uso" });
        }
      }

      // Salvar a senha original se estiver sendo atualizada
      const senhaOriginal = password;

      await admin.update({
        nome,
        email,
        telefone,
        role,
        password
      });
      
      // Se a senha foi alterada, atualizar no Supabase Auth também
      if (password) {
        // Aqui você precisaria implementar a atualização da senha no Supabase Auth
        // Por enquanto, vamos apenas logar
        console.log('Senha atualizada - necessário implementar atualização no Supabase Auth');
      }

      const updatedAdmin = await Admin.findOne({
        where: { id: id },
      });

      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
      res.status(500).json({ error: "Erro ao atualizar admin" });
    }
  }

  static async deleteAdmin(req, res) {
    const { id } = req.params;

    try {
      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      await admin.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar admin:", error);
      res.status(500).json({ error: "Erro ao deletar admin" });
    }
  }
};