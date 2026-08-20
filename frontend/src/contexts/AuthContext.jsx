import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const MOCK_USUARIOS = {
  FUNCIONARIO: { id: 1, nome: 'Ana Costa', email: 'ana@empresa.com', papel: 'FUNCIONARIO', depto: 'TI' },
  GESTOR: { id: 2, nome: 'Carlos Souza', email: 'carlos@empresa.com', papel: 'GESTOR', depto: 'TI' },
  ADMIN: { id: 3, nome: 'Admin Pedro', email: 'admin@empresa.com', papel: 'ADMIN', depto: 'Diretoria' }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // Inicia deslogado

  const loginPorPerfil = (papel) => {
    if (MOCK_USUARIOS[papel]) {
      setUsuario(MOCK_USUARIOS[papel]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loginPorPerfil, logout, autenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);