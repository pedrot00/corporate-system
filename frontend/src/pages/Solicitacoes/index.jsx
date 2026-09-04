import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, CheckCircle, Clock, XCircle, ShoppingCart, CheckCheck, Trash2, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import NovaSolicitacaoModal from './components/NovaSolicitacaoModal';
import DetalhesModal from './components/DetalhesModal';

export default function Solicitacoes({ apenasMinhas = false }) {
  const { usuario } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('TODOS');
  const [prioridadeFiltro, setPrioridadeFiltro] = useState('TODOS');
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [itemDetalhes, setItemDetalhes] = useState(null);

  const isAdmin = usuario?.papel === 'ADMIN' || usuario?.perfil === 'ADMIN';

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
    const atendeDepartamento = departamentoFiltro === 'TODOS' || item.departamento === departamentoFiltro;
    const atendePrioridade = prioridadeFiltro === 'TODOS' || item.prioridade === prioridadeFiltro;
    
    return atendeBusca && atendeEstado && atendeDepartamento && atendePrioridade;
  });

  const handleTransicionarEstado = async (id, novoEstado, observacao = '') => {
    try {
      await api.put(`/solicitacoes/${id}`, { estado: novoEstado, observacao });
      carregarSolicitacoes(); 
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao atualizar estado.');
    }
  };

  const handleCriarSolicitacao = async (dadosNovos) => {
    try {
      await api.post('/solicitacoes', dadosNovos);
      carregarSolicitacoes(); 
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao criar solicitação.');
    }
  };

  const handleDeletarSolicitacao = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta solicitação permanentemente?')) return;
    try {
      await api.delete(`/solicitacoes/${id}`);
      carregarSolicitacoes(); 
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir solicitação.');
    }
  };

  const abrirDetalhes = async (id) => {
    try {
      const response = await api.get(`/solicitacoes/${id}`);
      setItemDetalhes(response.data);
    } catch (error) {
      alert('Erro ao carregar detalhes.');
    }
  };

  const handleExportarCSV = () => {
    if (chamadosFiltrados.length === 0) {
      return alert('Não há dados para exportar.');
    }
    
    const cabecalho = ['ID', 'Titulo', 'Prioridade', 'Categoria', 'Solicitante', 'Departamento', 'Valor Estimado', 'Estado'];
    
    const linhas = chamadosFiltrados.map(item => [
      item.id,
      `"${item.titulo}"`, 
      item.prioridade,
      `"${item.categoria}"`,
      `"${item.solicitante?.nome || 'Desconhecido'}"`,
      `"${item.departamento}"`,
      item.valorEstimado,
      item.estado
    ]);

    const csvContent = "\uFEFF" + [cabecalho.join(';'), ...linhas.map(l => l.join(';'))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'solicitacoes_exportadas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {apenasMinhas ? 'Minhas Solicitações' : 'Todas as Solicitações'}
          </h1>
          <p className="text-sm text-slate-500">
            {apenasMinhas ? 'Acompanhe e reenvie seus pedidos' : 'Gerencie o ciclo de aprovação e aquisição'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center shadow-sm">
            Total: {chamadosFiltrados.length}
          </div>
          <button
            onClick={handleExportarCSV}
            className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={18} />
            Exportar CSV
          </button>

          <button
            onClick={() => setModalNovaAberto(true)}
            className="w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* FILTROS RESPONSIVOS */}
      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-black" size={18} />
          <input
            type="text"
            placeholder="Buscar por título, depto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring--500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-black shrink-0 hidden sm:block" />
          
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-black text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Estados (Todos)</option>
            <option value="PENDENTE">PENDENTE</option>
            <option value="SOLICITACAO_REENVIADA">SOLICITACAO_REENVIADA</option>
            <option value="APROVADA">APROVADA</option>
            <option value="EM_COMPRA">EM_COMPRA</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="REJEITADA">REJEITADA</option>
          </select>

          <select
            value={departamentoFiltro}
            onChange={(e) => setDepartamentoFiltro(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-black text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Deptos (Todos)</option>
            <option value="RH">RH</option>
            <option value="TI">TI</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Contabilidade">Contabilidade</option>
            <option value="Operações">Operações</option>
          </select>

          <select
            value={prioridadeFiltro}
            onChange={(e) => setPrioridadeFiltro(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-black text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Prioridade (Todas)</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
      </div>

      {/* TABELA COM SCROLL HORIZONTAL NO MOBILE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex justify-end md:hidden">
          <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-1 rounded">Deslize ↔</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
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
                      <span className="truncate max-w-[200px]" title={item.titulo}>{item.titulo}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
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
                  <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                    R$ {Number(item.valorEstimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirDetalhes(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> Detalhes
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletarSolicitacao(item.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir Solicitação"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {chamadosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Nenhuma solicitação encontrada com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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