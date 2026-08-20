import React, { useState } from 'react';
import { UserPlus, Search, Shield, Trash2 } from 'lucide-react';

const MOCK_INICIAL_USUARIOS = [
  { id: 1, nome: 'Ana Costa', email: 'ana.costa@empresa.com', papel: 'FUNCIONARIO', depto: 'TI' },
  { id: 2, nome: 'Carlos Souza', email: 'carlos.gestor@empresa.com', papel: 'GESTOR', depto: 'TI' },
  { id: 3, nome: 'Admin Pedro', email: 'admin@empresa.com', papel: 'ADMIN', depto: 'Diretoria' },
  { id: 4, nome: 'Mariana Silva', email: 'mariana.silva@empresa.com', papel: 'FUNCIONARIO', depto: 'Financeiro' },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(MOCK_INICIAL_USUARIOS);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    depto: 'TI',
    papel: 'FUNCIONARIO'
  });

  const excluirUsuario = (id) => {
    setUsuarios(prev => prev.filter(user => user.id !== id));
  };

  const handleCriarUsuario = (e) => {
    e.preventDefault();
    const novoid = usuarios.length + 1;
    setUsuarios([...usuarios, { ...novoUsuario, id: novoid }]);
    setModalAberto(false);
    setNovoUsuario({ nome: '', email: '', depto: 'TI', papel: 'FUNCIONARIO' });
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.depto.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Usuários</h1>
          <p className="text-sm text-slate-500">Cadastre novos membros e gerencie os níveis de acesso</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* BARRA DE FILTRO */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou departamento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Departamento</th>
              <th className="p-4">Perfil de Acesso</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-slate-800">{u.nome}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </td>
                <td className="p-4 text-slate-600 font-medium">{u.depto}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                    u.papel === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                      : u.papel === 'GESTOR' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    <Shield size={12} />
                    {u.papel}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => excluirUsuario(u.id)}
                    title="Excluir Usuário"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800">Cadastrar Novo Usuário</h2>
            
            <form onSubmit={handleCriarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Souza"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="joao@empresa.com"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Departamento</label>
                  <select
                    value={novoUsuario.depto}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, depto: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="TI">TI</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operações">Operações</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RH">RH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Perfil de Acesso</label>
                  <select
                    value={novoUsuario.papel}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, papel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FUNCIONARIO">Funcionário</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}