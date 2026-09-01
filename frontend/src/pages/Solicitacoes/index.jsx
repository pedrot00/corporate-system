import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, CheckCircle, Clock, XCircle, ShoppingCart, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import NovaSolicitacaoModal from './components/NovaSolicitacaoModal';
import DetalhesModal from './components/DetalhesModal';

export default function Solicitacoes({ apenasMinhas = false }) {
  const { usuario } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [itemDetalhes, setItemDetalhes] = useState(null);

  // BUSCA OS DADOS DA API
  const carregarSolicitacoes = async () => {
    try {
      const response = await api.get('/solicitacoes');
      setSolicitacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const chamadosPorVisao = apenasMinhas 
    ? solicitacoes.filter(s => s.solicitanteId === usuario?.id)
    : solicitacoes;

  const chamadosFiltrados = chamadosPorVisao.filter(item => {
    const nomeSolicitante = item.solicitante?.nome || '';
    const atendeBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        nomeSolicitante.toLowerCase().includes(busca.toLowerCase()) ||
                        item.departamento.toLowerCase().includes(busca.toLowerCase());
    const atendeEstado = estadoFiltro === 'TODOS' || item.estado === estadoFiltro;
    return atendeBusca && atendeEstado;
  });

  const handleTransicionarEstado = async (id, novoEstado, observacao = '') => {
    try {
      await api.put(`/solicitacoes/${id}`, { estado: novoEstado, observacao });
      carregarSolicitacoes(); // Recarrega a lista após atualizar
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao atualizar estado.');
    }
  };

  const handleCriarSolicitacao = async (dadosNovos) => {
    try {
      await api.post('/solicitacoes', dadosNovos);
      carregarSolicitacoes(); // Recarrega a lista após criar
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao criar solicitação.');
    }
  };

  const abrirDetalhes = async (id) => {
    try {
      // Busca a solicitação com o histórico completo aninhado
      const response = await api.get(`/solicitacoes/${id}`);
      setItemDetalhes(response.data);
    } catch (error) {
      alert('Erro ao carregar detalhes.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {apenasMinhas ? 'Minhas Solicitações' : 'Todas as Solicitações'}
          </h1>
          <p className="text-sm text-slate-500">
            {apenasMinhas ? 'Acompanhe e reenvie seus pedidos' : 'Gerencie o ciclo de aprovação e aquisição'}
          </p>
        </div>

        <button
          onClick={() => setModalNovaAberto(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={18} />
          Nova Solicitação
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por título, departamento ou solicitante..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none"
          >
            <option value="TODOS">Todos os Estados</option>
            <option value="PENDENTE">PENDENTE</option>
            <option value="SOLICITACAO_REENVIADA">SOLICITACAO_REENVIADA</option>
            <option value="APROVADA">APROVADA</option>
            <option value="EM_COMPRA">EM_COMPRA</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="REJEITADA">REJEITADA</option>
          </select>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Item / Prioridade</th>
              <th className="p-4">Solicitante</th>
              <th className="p-4">Valor Est.</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chamadosFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    {item.titulo}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.prioridade === 'ALTA' ? 'bg-rose-100 text-rose-700' :
                      item.prioridade === 'MEDIA' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.prioridade}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{item.categoria}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-700">{item.solicitante?.nome || 'Desconhecido'}</div>
                  <div className="text-xs text-slate-400">{item.departamento}</div>
                </td>
                <td className="p-4 font-bold text-slate-800">
                  R$ {Number(item.valorEstimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.estado === 'APROVADA' ? 'bg-emerald-100 text-emerald-800' :
                    item.estado === 'REJEITADA' ? 'bg-rose-100 text-rose-800' :
                    item.estado === 'EM_COMPRA' ? 'bg-blue-100 text-blue-800' :
                    item.estado === 'FINALIZADA' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.estado === 'APROVADA' && <CheckCircle size={12} />}
                    {item.estado === 'REJEITADA' && <XCircle size={12} />}
                    {['PENDENTE', 'SOLICITACAO_REENVIADA'].includes(item.estado) && <Clock size={12} />}
                    {item.estado === 'EM_COMPRA' && <ShoppingCart size={12} />}
                    {item.estado === 'FINALIZADA' && <CheckCheck size={12} />}
                    {item.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => abrirDetalhes(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <Eye size={14} /> Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NovaSolicitacaoModal
        aberto={modalNovaAberto}
        onClose={() => setModalNovaAberto(false)}
        onCriar={handleCriarSolicitacao}
        usuario={usuario}
      />

      <DetalhesModal
        item={itemDetalhes}
        onClose={() => setItemDetalhes(null)}
        onAtualizarEstado={handleTransicionarEstado}
        usuario={usuario}
        apenasMinhas={apenasMinhas}
      />
    </div>
  );
}