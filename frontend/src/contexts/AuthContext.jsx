import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem('@App:token');

      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUsuario(response.data);
        } catch (error) {
          console.error('Erro ao recuperar perfil, token pode estar expirado ou inválido.');
          logout();
        }
      }
      setLoading(false);
    }

    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario: dadosUsuario } = response.data;

      localStorage.setItem('@App:token', token);
      
      setUsuario(dadosUsuario);
      
      return dadosUsuario;
    } catch (error) {
      console.error('Falha no login:', error.response?.data?.error || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('@App:token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      autenticado: !!usuario,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);