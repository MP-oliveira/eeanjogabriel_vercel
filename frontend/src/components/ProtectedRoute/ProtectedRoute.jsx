import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UseContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    // Usuário não autenticado, redireciona para login
    return <Navigate to="/login" replace />;
  }

  // Usuário autenticado, renderiza o conteúdo protegido
  return children;
};

export default ProtectedRoute; 