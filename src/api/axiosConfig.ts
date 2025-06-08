// src/api/axiosConfig.ts

import axios from 'axios';

// 1) Lee SOLO la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

// 2) DEBUG: avísanos inmediatamente si NO la recibe
console.log('🔎 [axiosConfig] VITE_API_URL =', API_URL);

if (!API_URL) {
  console.error(
    '🚨 [axiosConfig] ERROR: VITE_API_URL NO está definida. ' +
    'Revisa tus Environment Variables en Vercel (Key=VITE_API_URL).'
  );
}

// 3) ¡Sin fallback a localhost!
//    Cualquier llamada irá a `${API_URL}/api/...`
const api = axios.create({
  baseURL: `${API_URL}/api`
});

// 4) Interceptor para inyectar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
