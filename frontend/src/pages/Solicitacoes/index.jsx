import React, { useState } from 'react';
import { Search, MoreVertical, Plus } from 'lucide-react'; // <-- Importamos o Plus
import DetalhesModal from './components/DetalhesModal';
import NovaSolicitacaoModal from './components/NovaSolicitacaoModal';
    // Dados fictícios para montarmos a interface inicial
    const mockSolicitacoes = [
      { id: '#00123', titulo: 'Monitor Dell 27"', departamento: 'TI', solicitante: 'Ana Costa', prioridade: 'Alta', valor: 2150.00, data: '15/10/2023', estado: 'PENDENTE' },
      { id: '#00124', titulo: 'Licença Software', departamento: 'TI', solicitante: 'Ana Costa', prioridade: 'Média', valor: 850.00, data: '15/10/2023', estado: 'APROVADA' },
      { id: '#00125', titulo: 'Cadeira Ergonômica', departamento: 'Gestor', solicitante: 'Gestor Carlos', prioridade: 'Baixa', valor: 1200.00, data: '15/10/2023', estado: 'EM_COMPRA' },
      { id: '#00126', titulo: 'Teclado Mecânico', departamento: 'TI', solicitante: 'Gestor Carlos', prioridade: 'Média', valor: 750.00, data: '15/10/2023', estado: 'FINALIZADA' },
      { id: '#00127', titulo: 'Mesa de Escritório', departamento: 'Gestor', solicitante: 'Ana Costa', prioridade: 'Baixa', valor: 1000.00, data: '15/10/2023', estado: 'REJEITADA' },
    ];
    const mockInicial = [
      { id: '#00123', titulo: 'Monitor Dell 27"', departamento: 'TI', solicitante: 'Ana Costa', prioridade: 'Alta', valor: 2150.00, data: '15/10/2023', estado: 'PENDENTE' },
      { id: '#00124', titulo: 'Licença Software', departamento: 'TI', solicitante: 'Ana Costa', prioridade: 'Média', valor: 850.00, data: '15/10/2023', estado: 'APROVADA' },
      { id: '#00125', titulo: 'Cadeira Ergonômica', departamento: 'Gestor', solicitante: 'Gestor Carlos', prioridade: 'Baixa', valor: 1200.00, data: '15/10/2023', estado: 'EM_COMPRA' },
    ];

    // Funções utilitárias para as cores dos "Badges"
    const getEstadoColor = (estado) => {
      const colors = {
        'PENDENTE': 'bg-yellow-100 text-yellow-800',
        'APROVADA': 'bg-blue-100 text-blue-800',
        'EM_COMPRA': 'bg-purple-100 text-purple-800',
        'FINALIZADA': 'bg-green-100 text-green-800',
        'REJEITADA': 'bg-red-100 text-red-800',
      };
      return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const getPrioridadeColor = (prioridade) => {
      const colors = {
        'Alta': 'bg-red-100 text-red-800',
        'Média': 'bg-gray-100 text-gray-800', // Adaptado para manter leveza visual
        'Baixa': 'bg-gray-100 text-gray-800',
      };
      return colors[prioridade] || 'bg-gray-100 text-gray-800';
    };

    export default function Solicitacoes() {
  // ESTADO DA NOSSA TABELA (Agora ela é dinâmica!)
  const [listaSolicitacoes, setListaSolicitacoes] = useState(mockInicial);

  // ESTADOS DOS FILTROS
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroDepto, setFiltroDepto] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // ESTADOS DOS MODAIS
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [novaSolicitacaoAberto, setNovaSolicitacaoAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  const abrirDetalhes = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setDetalhesAberto(true);
  };

  // Função que recebe a nova solicitação do Modal e joga na tabela
  const adicionarNovaSolicitacao = (novaSolicitacao) => {
    // Colocamos o item novo no começo da lista, e depois espalhamos o resto da lista antiga
    setListaSolicitacoes([novaSolicitacao, ...listaSolicitacoes]);
  };
  const atualizarStatusDaSolicitacao = (idDaSolicitacao, novoStatus) => {
    // Mapeamos a lista antiga. Se acharmos o ID correto, atualizamos o status.
    const listaAtualizada = listaSolicitacoes.map((item) => {
      if (item.id === idDaSolicitacao) {
        return { ...item, estado: novoStatus };
      }
      return item;
    });
    setListaSolicitacoes(listaAtualizada);
  }
  // LÓGICA DE FILTRAGEM
  const solicitacoesFiltradas = listaSolicitacoes.filter((item) => {
    // Verifica se o texto digitado bate com o título ou o nome do solicitante
    const matchBusca = item.titulo.toLowerCase().includes(termoBusca.toLowerCase()) || 
                       item.solicitante.toLowerCase().includes(termoBusca.toLowerCase());
    
    // Verifica se o departamento bate (ou se é 'Todos')
    const matchDepto = filtroDepto === 'Todos' || item.departamento === filtroDepto;
    
    // Verifica se o status bate (ou se é 'Todos')
    const matchStatus = filtroStatus === 'Todos' || item.estado === filtroStatus;

    // Só exibe o item se ele passar nos 3 testes
    return matchBusca && matchDepto && matchStatus;
  });
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      
      {/* CABEÇALHO DA TABELA E BOTÃO NOVO */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-slate-800">Gestão de Solicitações</h2>
        <button 
          onClick={() => setNovaSolicitacaoAberto(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Nova Solicitação
        </button>
      </div>

      {/* FILTROS CONECTADOS */}
      <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-white">
        <div className="md:col-span-2 relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por item ou solicitante..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Departamento</label>
          <select 
            value={filtroDepto}
            onChange={(e) => setFiltroDepto(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="Todos">Todos os departamentos</option>
            <option value="TI">TI</option>
            <option value="RH">RH</option>
            <option value="Gestor">Gestão</option>
            <option value="Financeiro">Financeiro</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
          <select 
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="Todos">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="APROVADA">Aprovada</option>
            <option value="EM_COMPRA">Em Compra</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="REJEITADA">Rejeitada</option>
          </select>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* o thead continua igual, não precisa mexer */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Depto</th>
              <th className="px-6 py-4">Solicitante</th>
              <th className="px-6 py-4">Prioridade</th>
              <th className="px-6 py-4">Valor (R$)</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* ATENÇÃO AQUI: Mudamos de listaSolicitacoes.map para solicitacoesFiltradas.map */}
            {solicitacoesFiltradas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4">{item.titulo}</td>
                <td className="px-6 py-4">{item.departamento}</td>
                <td className="px-6 py-4">{item.solicitante}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(item.prioridade)}`}>
                    {item.prioridade}
                  </span>
                </td>
                <td className="px-6 py-4">{item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4">{item.data}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => abrirDetalhes(item)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Mensagem caso a pesquisa não encontre nada */}
            {solicitacoesFiltradas.length === 0 && (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  Nenhuma solicitação encontrada com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDERIZANDO OS DOIS MODAIS */}
      <DetalhesModal 
        isOpen={detalhesAberto} 
        onClose={() => setDetalhesAberto(false)} 
        solicitacao={solicitacaoSelecionada} 
        onStatusChange={atualizarStatusDaSolicitacao}
      />
      
      <NovaSolicitacaoModal 
        isOpen={novaSolicitacaoAberto}
        onClose={() => setNovaSolicitacaoAberto(false)}
        onSave={adicionarNovaSolicitacao}
      />
    </div>
  );
  
}