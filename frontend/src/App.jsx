import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Layout from './pages/Layout';
import Login from './pages/Login';
import Solicitacoes from './pages/Solicitacoes';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Relatorios from './pages/Relatorios';

// Guard de Proteção: Valida autenticação e permissões por perfil
function RotaProtegida({ children, papeisPermitidos = [] }) {
  const { usuario, autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (papeisPermitidos.length > 0 && !papeisPermitidos.includes(usuario.papel)) {
    const destinoPadrao = usuario.papel === 'FUNCIONARIO' ? '/minhas-solicitacoes' : '/dashboard';
    return <Navigate to={destinoPadrao} replace />;
  }

  return children;
}

// Redireciona a rota raiz (/) baseando-se no papel ativo
function RedirecionamentoInicial() {
  const { usuario, autenticado } = useAuth();

  if (!autenticado) return <Navigate to="/login" replace />;
  if (usuario.papel === 'FUNCIONARIO') return <Navigate to="/minhas-solicitacoes" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ROTA PÚBLICA */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS (ENVOLVIDAS PELO LAYOUT) */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<RedirecionamentoInicial />} />

                  <Route
                    path="/dashboard"
                    element={
                      <RotaProtegida papeisPermitidos={['GESTOR', 'ADMIN']}>
                        <Dashboard />
                      </RotaProtegida>
                    }
                  />

                  <Route
                    path="/solicitacoes"
                    element={
                      <RotaProtegida papeisPermitidos={['GESTOR', 'ADMIN']}>
                        <Solicitacoes />
                      </RotaProtegida>
                    }
                  />

                  <Route
                    path="/minhas-solicitacoes"
                    element={
                      <RotaProtegida papeisPermitidos={['FUNCIONARIO', 'GESTOR', 'ADMIN']}>
                        <Solicitacoes apenasMinhas={true} />
                      </RotaProtegida>
                    }
                  />

                  <Route
                    path="/relatorios"
                    element={
                      <RotaProtegida papeisPermitidos={['GESTOR', 'ADMIN']}>
                        <Relatorios />
                      </RotaProtegida>
                    }
                  />

                  <Route
                    path="/usuarios"
                    element={
                      <RotaProtegida papeisPermitidos={['ADMIN']}>
                        <Usuarios />
                      </RotaProtegida>
                    }
                  />

                  <Route path="*" element={<RedirecionamentoInicial />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}