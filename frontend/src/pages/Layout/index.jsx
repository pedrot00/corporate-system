import React from 'react';
import { LayoutDashboard, FileText, BarChart2, Bell, ChevronDown } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
            {/* Um ícone de placeholder simulando a logo do protótipo */}
            <div className="w-6 h-6 bg-slate-700 rounded-md"></div>
            Companio
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg transition-colors">
            <FileText size={20} />
            <span className="font-medium">Solicitações</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <BarChart2 size={20} />
            <span className="font-medium">Relatórios</span>
          </a>
        </nav>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            Portal de Aquisições Corporativas
          </h1>

          {/* Área do Usuário / Notificações */}
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer">
              {/* Avatar do Usuário */}
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                Admin
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico (onde as páginas serão renderizadas) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}