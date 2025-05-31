import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'https://back-eeanjogabriel-vercel-nine.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// const API_URL = process.env.NODE_ENV === 'production'
//   ? 'https://eeanjogabriel.vercel.app/api'
//   : 'http://localhost:3001/api';

// // Configuração global do Axios
// axios.defaults.baseURL = API_URL;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// // Interceptor para tratamento de erros
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       console.error('Erro na resposta:', error.response.data);
//       return Promise.reject(error.response.data);
//     } else if (error.request) {
//       console.error('Erro na requisição:', error.request);
//       return Promise.reject({
//         message: 'Não foi possível conectar ao servidor. Verifique sua conexão.'
//       });
//     } else {
//       console.error('Erro:', error.message);
//       return Promise.reject({
//         message: 'Ocorreu um erro ao processar sua requisição.'
//       });
//     }
//   }
// );

// export const api = axios;

// export const endpoints = {
//   auth: {
//     login: '/auth/login',
//     register: '/auth/register',
//     logout: '/auth/logout',
//     refresh: '/auth/refresh'
//   },
//   users: {
//     profile: '/users/profile',
//     update: '/users/update'
//   }
// };

export default api;
