// src/api/axiosConfig.ts
import axios from 'axios';

const RAW = import.meta.env.VITE_API_URL;
if (!RAW) throw new Error('VITE_API_URL no definida');

const BASE = RAW.replace(/\/$/, '');      // quita “/” final si existe
const api = axios.create({
  baseURL: `${BASE}/api`,                 // apuntamos siempre a /api
  headers: { 'Content-Type': 'application/json' },
});

// Adjuntar JWT si existe
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
