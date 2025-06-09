// src/api/axiosConfig.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error('🚨 VITE_API_URL no definida');
}

const api = axios.create({
  baseURL: API_URL,  // ✅ Sin "/api" aquí
  withCredentials: true,
});

export default api;
