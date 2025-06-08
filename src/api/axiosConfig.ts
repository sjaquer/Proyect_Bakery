// src/api/axiosConfig.ts

import axios from 'axios';

// 1) Lee SOLO la variable de entorno inyectada por Vercel
const API_URL = import.meta.env.VITE_API_URL;

// 2) DEBUG: informa en consola si no la recibe
console.log('🔎 [axiosConfig] VITE_API_URL =', API_URL);
if (!API_URL) {
  console.error(
    '🚨 [axiosConfig] ERROR: VITE_API_URL NO está definida. ' +
    'Revisa tus Environment Variables en Vercel (Key=VITE_API_URL).'
  );
}

// 3) Crea la instancia de Axios sin fallback a localhost
const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
