// src/api/axiosConfig.ts
// ----------------------
// Configuración de Axios para comunicarse con tu backend remoto.
// BaseURL = `${REACT_APP_API_URL}/api` (p. ej. https://api.tudominio.com:4000/api)

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'; 
// (esto permite fallback local en caso de no definir la var)

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor: antes de cada petición, añade Authorization: Bearer <token> si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
