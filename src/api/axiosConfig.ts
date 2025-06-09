// src/api/axiosConfig.ts

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Debe apuntar a tu backend en Render
  withCredentials: true,                  // Para enviar cookies/autorización
});

export default api;
