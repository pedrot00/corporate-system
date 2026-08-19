import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2 } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* MENU LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="font-bold text-slate-800 text-lg">Companio</span>
          </div>

          {/* LINKS DE NAVEGAÇÃO */}
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/solicitacoes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <FileText size={18} />
              Solicitações
            </NavLink>

            <NavLink
              to="/relatorios"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <BarChart2 size={18} />
              Relatórios
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO DINÂMICO (Renders Dashboard ou Solicitações) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}