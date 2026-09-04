import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCheck, BarChart2, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  const fecharMenu = () => setMenuAberto(false);

  const menuItens = [
    {
      titulo: 'Dashboard',
      rota: '/dashboard',
      icone: LayoutDashboard,
      perfis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Relatórios',
      rota: '/relatorios',
      icone: BarChart2,
      perfis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Todas as Solicitações',
      rota: '/solicitacoes',
      icone: FileText,
      perfis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Minhas Solicitações',
      rota: '/minhas-solicitacoes',
      icone: UserCheck,
      perfis: ['FUNCIONARIO', 'GESTOR', 'ADMIN']
    },
    {
      titulo: 'Gestão de Usuários',
      rota: '/usuarios',
      icone: Users,
      perfis: ['ADMIN']
    }
  ];

  const menuFiltrado = menuItens.filter(item => item.perfis.includes(usuario?.perfil));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER MOBILE */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-bold text-slate-800 text-lg">Companio</span>
        </div>
        <button 
          onClick={() => setMenuAberto(!menuAberto)} 
          className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* OVERLAY */}
      {menuAberto && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-30" 
          onClick={fecharMenu}
        />
      )}

      {/* SIDEBAR (Barra lateral) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out
        ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* LOGO */}
        <div className="hidden md:flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-bold text-slate-800 text-lg">Companio</span>
        </div>

        {/* PERFIL DO USUÁRIO */}
        {usuario && (
          <div className="mb-6 pb-6 border-b border-slate-100">
            <div className="bg-slate-50 p-3 rounded-xl border border-indigo-300 flex items-center justify-between shadow-sm border border-[#716ad8]">
              <div>
                <p className="text-xs font-bold text-slate-800">{usuario.nome}</p>
                <p className="text-[11px] text-slate-500 capitalize">{usuario?.perfil?.toLowerCase()}</p>
              </div>
              <button
                onClick={handleSair}
                title="Sair do Sistema"
                className="text-red-600 p-1.5 rounded-lg border border-transparent transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO */}
        <nav className="space-y-1.5">
          {menuFiltrado.map((item) => {
            const Icon = item.icone;
            return (
              <NavLink
                key={item.rota}
                to={item.rota}
                onClick={fecharMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                {item.titulo}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}