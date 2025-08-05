
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlla se l'utente è già loggato al caricamento
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      // Salva token e dati utente
      localStorage.setItem('token', response.token);
      
      // Decodifica il token per ottenere info utente (email)
      const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
      const userData = {
        email: tokenPayload.sub,
        roles: tokenPayload.roles || [],
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
      return { success: false, error: err.response?.data?.message };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};