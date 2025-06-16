import axios from 'axios';

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'http://localhost:3000';
console.log('🔎 [axiosConfig] baseURL =', API_URL);

const base = API_URL.replace(/\/$/, '');
// Avoid duplicating the `/api` segment if provided in VITE_API_URL
const apiBaseURL = base.endsWith('/api') ? base : `${base}/api`;

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// **INTERCEPTOR** para mandar siempre el token en Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo global de 401
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
