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

  const menuItens = [
    {
      titulo: 'Dashboard',
      rota: '/dashboard',
      icone: LayoutDashboard,
      papeis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Minhas Solicitações',
      rota: '/minhas-solicitacoes',
      icone: UserCheck,
      papeis: ['FUNCIONARIO', 'GESTOR', 'ADMIN']
    },
    {
      titulo: 'Todas as Solicitações',
      rota: '/solicitacoes',
      icone: FileText,
      papeis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Relatórios',
      rota: '/relatorios',
      icone: BarChart2,
      papeis: ['GESTOR', 'ADMIN']
    },
    {
      titulo: 'Gestão de Usuários',
      rota: '/usuarios',
      icone: Users,
      papeis: ['ADMIN']
    }
  ];

  const menuFiltrado = menuItens.filter(item => item.papeis.includes(usuario?.papel));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="font-bold text-slate-800 text-lg">Companio</span>
          </div>

          <nav className="space-y-1">
            {menuFiltrado.map((item) => {
              const Icon = item.icone;
              return (
                <NavLink
                  key={item.rota}
                  to={item.rota}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
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
        </div>

        {/* RODAPÉ DO USUÁRIO LOGADO + LOGOUT */}
        {usuario && (
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{usuario.nome}</p>
                <p className="text-[11px] text-slate-500 capitalize">{usuario.papel.toLowerCase()}</p>
              </div>
              <button
                onClick={handleSair}
                title="Sair do Sistema"
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-white transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}