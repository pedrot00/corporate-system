import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Shield, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Usuarios() {
  const { usuario: adminLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal de cadastro
  const [modalAberto, setModalAberto] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    departamento: 'TI',
    perfil: 'FUNCIONARIO'
  });

  // Modal de exclusão com senha
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleIniciarExclusao = (usuarioAlvo) => {
    if (usuarioAlvo.id === adminLogado?.id) {
      alert("Você não pode excluir sua própria conta de Administrador.");
      return;
    }
    setUsuarioParaExcluir(usuarioAlvo);
    setSenhaConfirmacao('');
    setErroExclusao('');
  };

  const handleConfirmarExclusao = async (e) => {
    e.preventDefault();
    if (!senhaConfirmacao) {
      setErroExclusao('Digite sua senha para confirmar.');
      return;
    }

    try {
      setExcluindo(true);
      setErroExclusao('');

      await api.delete(`/usuarios/${usuarioParaExcluir.id}`, {
        data: { 
          senhaAdmin: senhaConfirmacao,
          adminId: adminLogado?.id 
        }
      });

      setUsuarios(prev => prev.filter(user => user.id !== usuarioParaExcluir.id));
      setUsuarioParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setErroExclusao(error.response?.data?.erro || 'Senha incorreta ou erro ao excluir.');
    } finally {
      setExcluindo(false);
    }
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', novoUsuario);
      setModalAberto(false);
      setNovoUsuario({ nome: '', email: '', senha: '', departamento: 'TI', perfil: 'FUNCIONARIO' });
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário. Verifique se o e-mail já está em uso.');
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.departamento?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Usuários</h1>
          <p className="text-sm text-slate-500">Cadastre novos membros e gerencie os níveis de acesso</p>
        </div>
        {/* Botão ocupa 100% no celular */}
        <button
          onClick={() => setModalAberto(true)}
          className="w-full md:w-auto justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* BUSCA */}
      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou depto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TABELA DE USUÁRIOS COM SCROLL HORIZONTAL NO MOBILE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex justify-end md:hidden">
          <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-1 rounded">Deslize ↔</span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando usuários...</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Departamento</th>
                  <th className="p-4">Perfil de Acesso</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-slate-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => {
                    const eProprioUsuario = u.id === adminLogado?.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            <span className="truncate max-w-[150px] sm:max-w-[250px]" title={u.nome}>{u.nome}</span>
                            {eProprioUsuario && (
                              <span className="shrink-0 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{u.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{u.departamento}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                            u.perfil === 'ADMIN' 
                              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                              : u.perfil === 'GESTOR' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-slate-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            <Shield size={12} />
                            {u.perfil}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleIniciarExclusao(u)}
                            disabled={eProprioUsuario}
                            title={eProprioUsuario ? "Você não pode excluir sua própria conta" : "Excluir Usuário"}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              eProprioUsuario 
                                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                                : 'border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO COM SENHA */}
      {usuarioParaExcluir && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* Ajuste de padding (p-4 sm:p-6) */}
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-lg shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Confirmar Exclusão</h2>
                <p className="text-xs text-slate-500">Ação irreversível</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Para excluir a conta de <strong className="text-slate-800 break-words">{usuarioParaExcluir.nome}</strong>, confirme com a sua senha de administrador:
            </p>

            <form onSubmit={handleConfirmarExclusao} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Sua Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Digite sua senha..."
                    value={senhaConfirmacao}
                    onChange={(e) => setSenhaConfirmacao(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                {erroExclusao && (
                  <p className="text-xs font-medium text-rose-600 mt-1.5">{erroExclusao}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUsuarioParaExcluir(null)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={excluindo}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 order-1 sm:order-2"
                >
                  {excluindo ? 'Validando...' : 'Excluir Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO DE NOVO USUÁRIO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
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

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Senha de Acesso</label>
                <input
                  type="password"
                  required
                  placeholder="Defina uma senha"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Departamento</label>
                  <select
                    value={novoUsuario.departamento}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, departamento: e.target.value })}
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
                    value={novoUsuario.perfil}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, perfil: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FUNCIONARIO">Funcionário</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm order-1 sm:order-2"
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