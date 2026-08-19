import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos componentes de páginas
import Layout from './pages/Layout';
import Solicitacoes from './pages/Solicitacoes';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      {/* O Layout envolve todas as rotas ativas */}
      <Layout>
        <Routes>
          {/* Redireciona a raiz (/) para o Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rotas ativas da aplicação */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solicitacoes" element={<Solicitacoes />} />
          
          {/* Placeholder para futuras páginas */}
          <Route 
            path="/relatorios" 
            element={<div className="p-8 text-slate-500">Página de Relatórios (Em construção)</div>} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}