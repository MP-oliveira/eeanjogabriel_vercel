import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Criar o contexto
export const UserContext = createContext();

// Provedor do contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verificar se há usuário logado no localStorage quando a aplicação carrega
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar dados inválidos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};
