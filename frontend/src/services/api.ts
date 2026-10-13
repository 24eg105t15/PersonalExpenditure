import axios from 'axios';

export const getApiBaseUrl = () => {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('spendwise_api_url') : null;
  const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  const rawUrl = customUrl || envApiUrl || '/api';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  return (cleanUrl.startsWith('http') && !cleanUrl.endsWith('/api')) ? `${cleanUrl}/api` : cleanUrl;
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('spendwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('spendwise_token');
        localStorage.removeItem('spendwise_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);
