import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const realizarLogin = async (emailLogin, senhaLogin) => {
    setErro('');
    setCarregando(true);
    
    try {
      const usuarioLogado = await login(emailLogin, senhaLogin);
      
      if (usuarioLogado?.perfil === 'FUNCIONARIO') {
        navigate('/minhas-solicitacoes');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErro('E-mail ou senha incorretos. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await realizarLogin(email, senha);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-indigo-200">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acessar o Companio</h1>
          <p className="text-sm text-slate-500">Entre com suas credenciais para continuar</p>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {erro}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
          >
            {carregando ? 'Entrando...' : 'Entrar no Sistema'}
            {!carregando && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-xs font-medium text-slate-400 text-center flex items-center justify-center gap-1">
            <UserCheck size={14} /> Atalhos para teste do portfólio:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => realizarLogin('joao@empresa.com', '123456')}
              className="w-full px-2 py-2 sm:py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg sm:rounded text-xs font-medium transition-colors"
            >
              Funcionário
            </button>
            <button
              type="button"
              onClick={() => realizarLogin('gestor@empresa.com', '123456')}
              className="w-full px-2 py-2 sm:py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg sm:rounded text-xs font-medium transition-colors"
            >
              Gestor
            </button>
            <button
              type="button"
              onClick={() => realizarLogin('admin@empresa.com', '123456')}
              className="w-full px-2 py-2 sm:py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg sm:rounded text-xs font-medium transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}