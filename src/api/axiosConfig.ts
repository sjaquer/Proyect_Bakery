// src/api/axiosConfig.ts

import axios from 'axios';

const raw = import.meta.env.VITE_API_URL;
if (!raw) {
  throw new Error('🚨 VITE_API_URL no definida');
}

// Quita barra final si la hubiera, luego agrega "/api"
const base =
  raw.endsWith('/') && raw.length > 1 ? raw.slice(0, raw.length - 1) : raw;

const api = axios.create({
  baseURL: `${base}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Si usas JWT en localStorage, adjúntalo automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
