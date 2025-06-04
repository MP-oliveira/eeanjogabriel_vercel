const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");

const supabase = require("../db/supabaseCilent");

module.exports = class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
  
    // Validação básica das entradas
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
  
    // Log para debug
    console.log("Tentativa de login para:", email);

    try {
      // Verificar em qual tabela o usuário está presente
      const roles = [
        { table: "admins", role: "admin" },
        { table: "professores", role: "professor" },
      ];
      let userRole = null;
      let userData = null;
      
      // Primeiro, encontrar o usuário e sua senha hash
      for (const { table, role } of roles) {
        console.log(`Verificando usuário na tabela ${table}...`);
        
        const { data: foundUser, error: roleError } = await supabase
          .from(table)
          .select("id, nome, email, password, role")
          .or(`email.eq.${email},email.eq.${email.toLowerCase()}`)
          .single();
        
        if (roleError) {
          console.log(`Erro ao buscar na tabela ${table}:`, roleError.message);
          continue;
        }
        
        if (foundUser) {
          console.log(`Usuário encontrado na tabela ${table}`);
          userRole = role;
          userData = foundUser;
          break;
        }
      }

      if (!userData) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      console.log("Dados do usuário encontrados:", {
        hasPassword: !!userData.password,
        email: userData.email,
        role: userData.role
      });

      if (!userData.password) {
        console.error("Senha não encontrada para o usuário");
        return res.status(401).json({ message: "Erro na configuração da conta" });
      }

      // Verificar a senha usando bcrypt
      const senhaValida = await bcrypt.compare(password, userData.password);
      
      if (!senhaValida) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      // Se a senha estiver correta, prosseguir com a autenticação no Supabase
      console.log("Iniciando autenticação no Supabase...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });
  
      console.log("Resposta da autenticação:", { 
        user: data?.user ? 'existe' : 'null', 
        session: data?.session ? 'existe' : 'null', 
        error: error ? error.message : 'nenhum' 
      });
  
      if (error) {
        console.error("Erro de autenticação:", error.message, error.code);
        return res.status(401).json({ 
          message: "Falha na autenticação", 
          error: error.message,
          code: error.code 
        });
      }
  
      // Verificação adicional de usuário
      if (!data || !data.user) {
        console.error("Dados de usuário ausentes na resposta");
        return res.status(401).json({ message: "Dados de autenticação incompletos" });
      }
  
      // Retornar o papel do usuário e o token de sessão
      console.log("Login bem-sucedido para usuário com função:", userRole);
      
      return res.status(200).json({
        message: "Login bem-sucedido",
        role: userRole,
        token: data.session.access_token,
        user: {
          id: data.user.id,
          nome: userData.nome,
          email: userData.email,
          role: userRole
        }
      });
      
    } catch (error) {
      console.error("Erro no servidor durante autenticação:", error);
      return res.status(500).json({ 
        message: "Erro interno no servidor durante autenticação", 
        error: error.message 
      });
    }
  }

  static async logout(req, res) {

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }

      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
  
  static async esqueciASenha(req, res) {
    const { email } = req.body;

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/esqueciasenha",
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.status(200).json({ message: "Link de recuperação enviado" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};
