import React, { createContext, useContext, useState, useEffect } from 'react';
// Importe a sua instância do axios configurada. 
// Ajuste o caminho '../services/api' se o seu arquivo api.js estiver em outro lugar no frontend.
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  
  // O loading ajuda a não piscar as telas privadas enquanto o React valida o token no F5
  const [loading, setLoading] = useState(true); 

  // 1. Efeito executado sempre que a aplicação carrega (ex: F5 na página)
  useEffect(() => {
    async function carregarUsuario() {
      // Busca o token que foi salvo no login
      const token = localStorage.getItem('@App:token');

      if (token) {
        try {
          // Se tem token, busca os dados do perfil no backend
          // Note que o interceptor do seu api.js já vai colocar o token no cabeçalho automaticamente[cite: 5]
          const response = await api.get('/auth/me');
          setUsuario(response.data);
        } catch (error) {
          console.error('Erro ao recuperar perfil, token pode estar expirado ou inválido.');
          logout(); // Se falhar (ex: token expirado), limpamos os dados
        }
      }
      setLoading(false); // Terminou a verificação
    }

    carregarUsuario();
  }, []);

  // 2. Nova função de login que substitui o loginPorPerfil
  const login = async (email, senha) => {
    try {
      // Bate no seu backend (AuthController)
      const response = await api.post('/auth/login', { email, senha });
      
      // Extrai os dados que o seu AuthService retorna
      const { token, usuario: dadosUsuario } = response.data;

      // Salva o token no navegador
      localStorage.setItem('@App:token', token);
      
      // Atualiza o estado global com os dados do banco
      setUsuario(dadosUsuario);
      
      return dadosUsuario; // <-- Altere aqui de true para dadosUsuario
    } catch (error) {
      console.error('Falha no login:', error.response?.data?.error || error.message);
      throw error; // Lança o erro para que a tela de Login possa exibir um aviso ao usuário
    }
  };

  // 3. Função de logout atualizada
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