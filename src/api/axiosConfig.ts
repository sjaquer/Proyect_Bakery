// src/api/axiosConfig.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error('🚨 VITE_API_URL no definida');
}

const api = axios.create({
  // Incluimos "/api" aquí para que todas las llamadas vayan a <VITE_API_URL>/api/...
  baseURL: `${API_URL.replace(/\/$/, '')}/api`,
  withCredentials: true,
});

export default api;
