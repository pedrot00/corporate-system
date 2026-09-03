import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCheck, BarChart2, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  // NOVA ORDEM DAS ABAS
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
      {/* Removemos o justify-between para os itens fluírem de cima para baixo naturalmente */}
      <aside className="w-64 bg-white border-r border-black-200 p-6 flex flex-col shrink-0 overflow-y-auto">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-bold text-slate-800 text-lg">Companio</span>
        </div>

        {/* PERFIL DO USUÁRIO NO TOPO (MOVIDO DO RODAPÉ) */}
        {usuario && (
          <div className="mb-6 pb-6 border-b border-slate-100  ">
            <div className="bg-slate-50 p-3 rounded-xl border border-indigo-300 flex items-center justify-between shadow-sm  border border-[#716ad8]">
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

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}