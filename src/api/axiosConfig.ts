// src/api/axiosConfig.ts

import axios from 'axios';

// 1) Forzar el uso de la URL de tu túnel ngrok (sin fallback a localhost)
const API_URL = import.meta.env.VITE_API_URL;

// 2) Debug: avísanos si no está definido
if (!API_URL) {
  console.error(
    '🚨 VITE_API_URL NO está definida. ' +
    'Revisa "Environment Variables" en Vercel (key=VITE_API_URL).'
  );
}

// 3) Crea la instancia de Axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// 4) Interceptor para añadir el token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
