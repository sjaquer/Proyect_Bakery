import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  // Esto te ayudará a ver en consola si la variable NO está llegando
  console.error('🚨 VITE_API_URL no está definido – revisa tus env vars en Vercel');
}

export const api = axios.create({
  baseURL: `${API_URL}/api`, 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;