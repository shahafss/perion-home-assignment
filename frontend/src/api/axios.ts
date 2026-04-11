import axios from 'axios';
import { useAuth } from '../composables/useAuth';

export const apiClient = axios.create({
  baseURL: '/api'
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAuth();
  if (token.value) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token.value}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const { logout } = useAuth();
      logout();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);
