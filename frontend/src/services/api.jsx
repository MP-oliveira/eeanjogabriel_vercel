import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'https://backend-4yks51315-mauricio-silva-oliveiras-projects.vercel.app/api', // Production URL
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
