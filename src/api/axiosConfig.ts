// src/api/axiosConfig.ts

import axios from 'axios';

// Si VITE_API_URL no está definido, lanzamos un error visible en consola
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error(
    '🚨 Error: VITE_API_URL no está definido. ' +
    'Revisa tus Environment Variables en Vercel.'
  );
}

// Creamos la instancia de Axios apuntando **solo** a la URL de ngrok (o tu API real)
const api = axios.create({
  baseURL: `${API_URL}/api`
});

// Interceptor para inyectar el token de auth
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
