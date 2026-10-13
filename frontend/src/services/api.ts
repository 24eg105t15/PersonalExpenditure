import axios from 'axios';

export const getApiBaseUrl = (): string => {
  // 1. Explicit user override in localStorage
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('spendwise_api_url');
    if (customUrl && customUrl.trim()) {
      const clean = customUrl.trim().replace(/\/+$/, '');
      return (clean.startsWith('http') && !clean.endsWith('/api')) ? `${clean}/api` : clean;
    }
  }

  // 2. Build-time environment variable if configured
  const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envApiUrl && envApiUrl.length > 0 && !envApiUrl.includes('undefined')) {
    const clean = envApiUrl.replace(/\/+$/, '');
    return (clean.startsWith('http') && !clean.endsWith('/api')) ? `${clean}/api` : clean;
  }

  // 3. Dynamic Render hostname resolution:
  // Automatically mirrors frontend service name to backend service name on Render
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onrender.com')) {
    const host = window.location.hostname;
    let apiHost = host;
    if (apiHost.includes('spendwise-web-v2')) {
      apiHost = apiHost.replace('spendwise-web-v2', 'spendwise-api-v2');
    } else if (apiHost.includes('spendwise-web')) {
      apiHost = apiHost.replace('spendwise-web', 'spendwise-api');
    } else if (apiHost.includes('spendwise-frontend')) {
      apiHost = apiHost.replace('spendwise-frontend', 'spendwise-backend');
    }
    return `https://${apiHost}/api`;
  }

  // 4. Default fallback (local development / same-origin proxy)
  return '/api';
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
