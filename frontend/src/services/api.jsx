import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Local backend for development
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar headers CORS
api.interceptors.request.use(
  (config) => {
    // Remove headers CORS desnecessários do cliente
    delete config.headers['Access-Control-Allow-Origin'];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;
