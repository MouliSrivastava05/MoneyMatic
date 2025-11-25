import axios from 'axios';

const DEFAULT_DEV_BASE = 'http://localhost:5000';

const resolveBaseUrl = () => {
  const raw = (process.env.REACT_APP_API_URL || DEFAULT_DEV_BASE).trim();
  if (!raw) return DEFAULT_DEV_BASE;

  // Absolute URL already provided
  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, '');
  }

  // Relative paths (e.g. "/api") should resolve differently for dev vs prod
  if (raw.startsWith('/')) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.endsWith('.local');

      const origin = isLocalhost ? DEFAULT_DEV_BASE : window.location.origin;
      return `${origin.replace(/\/$/, '')}${raw}`;
    }
    return raw;
  }

  return raw.replace(/\/$/, '');
};

const API_BASE_URL = resolveBaseUrl();
const baseEndsWithApi = API_BASE_URL.toLowerCase().endsWith('/api');

// Log API URL in development (helps debug connection issues)
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    // Allow REACT_APP_API_URL values that already include "/api" without breaking paths
    if (baseEndsWithApi && config.url?.startsWith('/api')) {
      config.url = config.url === '/api' ? '/' : config.url.replace(/^\/api/, '');
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


