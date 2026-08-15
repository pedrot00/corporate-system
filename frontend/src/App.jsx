import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos nossos componentes
import Layout from './pages/Layout';
import Solicitacoes from './pages/Solicitacoes';

export default function App() {
  return (
    <Router>
      {/* O Layout envolve todas as rotas. Assim, o menu lateral e o header não recarregam */}
      <Layout>
        <Routes>
          {/* Redireciona a raiz (/) automaticamente para a tela de solicitações */}
          <Route path="/" element={<Navigate to="/solicitacoes" replace />} />
          
          {/* Nossa tela principal já desenvolvida */}
          <Route path="/solicitacoes" element={<Solicitacoes />} />
          
          {/* Rotas de placeholder para o futuro */}
          <Route 
            path="/dashboard" 
            element={<div className="text-slate-500">Página de Dashboard (Em construção)</div>} 
          />
          <Route 
            path="/relatorios" 
            element={<div className="text-slate-500">Página de Relatórios (Em construção)</div>} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}