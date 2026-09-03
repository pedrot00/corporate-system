import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Calendar, Filter, DollarSign, ShoppingCart, TrendingUp, CheckCircle, Clock, XCircle, Inbox, Users, CheckCheck, ClipboardList } from 'lucide-react';
import { api } from '../../services/api'; 

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('30dias');
  const [departamento, setDepartamento] = useState('TODOS'); 
  
  const [dados, setDados] = useState([]);
  const [topSolicitantes, setTopSolicitantes] = useState([]);
  const [resumo, setResumo] = useState({ 
    totalFinalizado: 'R$ 0,00', 
    pedidosConcluidos: 0, 
    ticketMedio: 'R$ 0,00',
    qtdAprovados: 0,
    qtdEmCompra: 0,
    qtdRejeitadas: 0,
    qtdPendentes: 0
  });
  const [loading, setLoading] = useState(true);

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/relatorios?periodo=${periodo}&departamento=${departamento}`);
      setDados(response.data.tabela);
      setTopSolicitantes(response.data.topSolicitantes || []);
      setResumo(response.data.resumo);
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorios();
  }, [periodo, departamento]);

  const totalSolicitacoes = resumo.pedidosConcluidos + resumo.qtdAprovados + resumo.qtdEmCompra + resumo.qtdPendentes + resumo.qtdRejeitadas;

  // --- CORREÇÃO DO CSV ---
  const exportarCSV = () => {
    if (!resumo) return alert('Não há dados para exportar.');
    
    const linhasCSV = [
      'RESUMO FINANCEIRO',
      `Total Finalizado;${resumo.totalFinalizado}`,
      `Total de Solicitacoes;${totalSolicitacoes}`,
      `Ticket Medio;${resumo.ticketMedio}`,
      '',
      'STATUS DAS SOLICITACOES',
      `Finalizadas;${resumo.pedidosConcluidos}`,
      `Aprovadas;${resumo.qtdAprovados}`,
      `Em Compras;${resumo.qtdEmCompra}`,
      `Pendentes;${resumo.qtdPendentes}`,
      `Rejeitadas;${resumo.qtdRejeitadas}`,
      '',
      'GASTOS POR CATEGORIA - SOLICITACOES FINALIZADAS',
      'Categoria;Quantidade;Valor Total',
      ...dados.map(item => `${item.categoria};${item.quantidade};${item.total}`),
      '',
      'TOP 5 SOLICITANTES',
      'Posicao;Colaborador;Pedidos;Valor Solicitado',
      ...topSolicitantes.map((user, idx) => `${idx + 1};${user.nome};${user.quantidade};${user.total}`)
    ];
    
    const conteudoCSV = '\uFEFF' + linhasCSV.join('\n'); 

    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_compras_${periodo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CORREÇÃO DO PDF ---
  const exportarPDF = () => {
    const janelaPDF = window.open('', '_blank');
    
    const htmlEstrutura = `
      <html>
        <head>
          <title>Relatório de Compras</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #334155; }
            h1 { color: #0f172a; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { color: #334155; font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
            .grid-resumo { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
            .card { border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; min-width: 150px; background: #f8fafc; }
            .card strong { display: block; font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
            .card span { font-size: 18px; font-weight: bold; color: #0f172a; }
            
            /* Cores laterais para acompanhar a identidade da tela */
            .card.finalizadas { border-left: 4px solid #a855f7; }
            .card.aprovadas { border-left: 4px solid #22c55e; }
            .card.compras { border-left: 4px solid #eab308; }
            .card.pendentes { border-left: 4px solid #818cf8; }
            .card.rejeitadas { border-left: 4px solid #ef4444; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; text-align: left; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 12px 8px; font-size: 14px; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 12px; }
            @media print { @page { margin: 1cm; } }
          </style>
        </head>
        <body>
          <h1>Relatório de Compras</h1>
          <p><strong>Período:</strong> ${periodo} | <strong>Departamento:</strong> ${departamento}</p>
          
          <h2>Resumo Financeiro</h2>
          <div class="grid-resumo">
            <div class="card"><strong>Total Finalizado</strong><span>${resumo.totalFinalizado}</span></div>
            <div class="card"><strong>Total de Solicitações</strong><span>${totalSolicitacoes}</span></div>
            <div class="card"><strong>Ticket Médio</strong><span>${resumo.ticketMedio}</span></div>
          </div>

          <h2>Status das Solicitações</h2>
          <div class="grid-resumo">
            <div class="card finalizadas"><strong>Finalizadas</strong><span>${resumo.pedidosConcluidos}</span></div>
            <div class="card aprovadas"><strong>Aprovadas</strong><span>${resumo.qtdAprovados}</span></div>
            <div class="card compras"><strong>Em Compras</strong><span>${resumo.qtdEmCompra}</span></div>
            <div class="card pendentes"><strong>Pendentes</strong><span>${resumo.qtdPendentes}</span></div>
            <div class="card rejeitadas"><strong>Rejeitadas</strong><span>${resumo.qtdRejeitadas}</span></div>
          </div>

          <h2>Gastos por Categoria - Solicitações Finalizadas</h2>
          <table>
            <thead><tr><th>Categoria</th><th>Quantidade</th><th>Valor Total</th></tr></thead>
            <tbody>
              ${dados.map(d => `<tr><td>${d.categoria}</td><td>${d.quantidade}</td><td>${d.total}</td></tr>`).join('')}
            </tbody>
          </table>

          <h2>Top Solicitantes</h2>
          <table>
            <thead><tr><th>Posição</th><th>Nome do Colaborador</th><th>Pedidos</th><th>Valor Solicitado</th></tr></thead>
            <tbody>
              ${topSolicitantes.map((s, i) => `<tr><td>${i + 1}º</td><td>${s.nome}</td><td>${s.quantidade}</td><td>${s.total}</td></tr>`).join('')}
            </tbody>
          </table>
          
          <script>
            window.onload = () => { 
              window.print(); 
              setTimeout(() => window.close(), 500); 
            }
          </script>
        </body>
      </html>
    `;

    janelaPDF.document.write(htmlEstrutura);
    janelaPDF.document.close();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios & Análises</h1>
          <p className="text-sm text-slate-500">Acompanhe métricas financeiras e volume de compras</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={exportarCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={18} />
            Exportar CSV
          </button>
          <button
            onClick={exportarPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-black" />
          <span className="text-sm font-semibold text-slate-700">Filtros:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-black rounded-lg px-3 py-1.5 text-xs">
            <Calendar size={14} className="text-black" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="ano">Ano Atual</option>
            </select>
          </div>

          <div className="bg-slate-50 border border-black rounded-lg px-3 py-1.5 text-xs">
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="TODOS">Todos os Departamentos</option>
              <option value="TI">TI</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Operações">Operações</option>
              <option value="RH">RH</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium animate-pulse">
          Calculando relatórios...
        </div>
      ) : (
        <>
          {/* CARDS RESUMO FINANCEIRO - 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Total Finalizado</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{resumo.totalFinalizado}</p>
            </div>

            {/* Total de Solicitações */}
            <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Total de Solicitações</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ClipboardList size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{totalSolicitacoes} chamados</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase">Ticket Médio / Pedido</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <DollarSign size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{resumo.ticketMedio}</p>
            </div>
          </div>

          {/* CARDS DE STATUS - 5 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* 1. FINALIZADAS (Roxo) */}
            <div className="bg-white p-5 rounded-xl border border-purple-500 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                <CheckCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Finalizadas</p>
                <p className="text-xl font-bold text-slate-800">{resumo.pedidosConcluidos} Solicitações</p>
              </div>
            </div>

            {/* 2. APROVADAS (Verde) */}
            <div className="bg-white p-5 rounded-xl border border-green-500 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Aprovadas</p>
                <p className="text-xl font-bold text-slate-800">{resumo.qtdAprovados} Solicitações</p>
              </div>
            </div>

            {/* 3. EM COMPRAS (Amarelo) */}
            <div className="bg-white p-5 rounded-xl border border-yellow-500 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Em Compras</p>
                <p className="text-xl font-bold text-slate-800">{resumo.qtdEmCompra} Solicitações</p>
              </div>
            </div>

            {/* 4. PENDENTES (Slate/Azul Claro) */}
            <div className="bg-white p-5 rounded-xl border border-indigo-300 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
                <Inbox size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Pendentes</p>
                <p className="text-xl font-bold text-slate-800">{resumo.qtdPendentes} Solicitações</p>
              </div>
            </div>

            {/* 5. REJEITADAS (Vermelho) */}
            <div className="bg-white p-5 rounded-xl border border-red-500 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-full">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Rejeitadas</p>
                <p className="text-xl font-bold text-slate-800">{resumo.qtdRejeitadas} Solicitações</p>
              </div>
            </div>

          </div>

          {/* SESSÃO DIVIDIDA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-indigo-500 font-bold text-slate-800 text-sm flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" />
                Gastos por Categoria - Solicitações Finalizadas
              </div>
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Categoria</th>
                    <th className="p-4 text-center">Qtd</th>
                    <th className="p-4 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dados.length > 0 ? (
                    dados.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800">{item.categoria}</td>
                        <td className="p-4 text-center text-slate-600">{item.quantidade}</td>
                        <td className="p-4 text-right font-bold text-slate-800">{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">Nenhum dado encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-indigo-500 font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users size={18} className="text-slate-400" />
                Top 5 Solicitantes
              </div>
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Colaborador</th>
                    <th className="p-4 text-center">Pedidos</th>
                    <th className="p-4 text-right">Valor Solicitado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topSolicitantes.length > 0 ? (
                    topSolicitantes.map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                            {idx + 1}
                          </span>
                          {user.nome}
                        </td>
                        <td className="p-4 text-center text-slate-600">{user.quantidade}</td>
                        <td className="p-4 text-right font-bold text-slate-800">{user.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">Nenhuma solicitação encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}
    </div>
  );
}