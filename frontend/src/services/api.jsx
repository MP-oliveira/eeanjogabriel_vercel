import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'https://back-eeanjogabriel-vercel-nine.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor (status code fora do range 2xx)
      switch (error.response.status) {
        case 401:
          // Token expirado ou inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Acesso negado
          console.error('Acesso negado:', error.response.data);
          break;
        case 404:
          // Recurso não encontrado
          console.error('Recurso não encontrado:', error.response.data);
          break;
        case 500:
          // Erro interno do servidor
          console.error('Erro interno do servidor:', error.response.data);
          break;
        default:
          console.error('Erro na requisição:', error.response.data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
