import api from './api';
import { AUTH_API_URL } from '../utils/constants';

export const authService = {
  login: async (credentials) => {
    const response = await api.post(`${AUTH_API_URL}/login`, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};