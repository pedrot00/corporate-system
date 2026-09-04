import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, ClipboardList, Ticket, Percent, 
  Calendar, RefreshCw, Clock, Download 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { api } from '../../services/api';

export default function Dashboard() {
  const [data, setData] = useState({
    kpis: { custoTotal: 0, totalSolicitacoes: 0, ticketMedio: 0, taxaAprovacao: 0, leadTime: 0 },
    evolucaoMensal: [],
    distribuicaoStatus: [],
    custoPorDepartamento: [],
    volumePorPrioridade: [],
    sazonalidade: [],
    mapaCalor: { categorias: [], dados: [] }
  });
  
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  
  const dashboardRef = useRef(null);

  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard'); 
      if (response.data && response.data.kpis) {
        const ordemMeses = { 
          'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6, 
          'Jul': 7, 'Ago': 8, 'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12 
        };

        if (response.data.evolucaoMensal) {
          response.data.evolucaoMensal.sort((a, b) => ordemMeses[a.mes] - ordemMeses[b.mes]);
        }
        setData(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const exportarPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      setExportando(true);
      const canvas = await html2canvas(dashboardRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#F8FAFC' 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dashboard-compras.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF.');
    } finally {
      setExportando(false);
    }
  };

  const getCorMapaCalor = (valor, maxValor) => {
    if (valor === 0) return 'bg-slate-50 text-slate-400';
    return `bg-indigo-600 text-white`; 
  };

  const getMaxHeatValue = () => {
    let max = 0;
    data.mapaCalor.dados.forEach(linha => {
      data.mapaCalor.categorias.forEach(cat => {
        if (linha[cat] > max) max = linha[cat];
      });
    });
    return max;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-slate-500 font-medium animate-pulse flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin" size={24} />
          Buscando indicadores em tempo real...
        </div>
      </div>
    );
  }

  const maxHeatValue = getMaxHeatValue();
  const coresStatus = { 'APROVADA': '#3B82F6', 'PENDENTE': '#F59E0B', 'EM_COMPRA': '#8B5CF6', 'REJEITADA': '#EF4444', 'FINALIZADA': '#10B981' };
  const getStatusColor = (status) => coresStatus[status] || '#94A3B8';

  return (
    <div ref={dashboardRef} className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm data-html2canvas-ignore">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-xs text-slate-500">Métricas gerais conectadas ao banco de dados</p>
        </div>
        {/* flex-wrap garante que os botões não vão espremer ou vazar da tela no celular */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            <Calendar size={14} className="text-slate-500" />
            <span className="hidden sm:inline">Painel Atual</span>
          </div>
          <button onClick={carregarDadosDashboard} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors" title="Atualizar dados">
            <RefreshCw size={16} />
          </button>
          
          <button 
            onClick={exportarPDF} 
            disabled={exportando}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex-1 md:flex-none justify-center
              ${exportando ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            {exportando ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
            {exportando ? 'Gerando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Custo Total</p>
              <h3 className="text-lg font-bold text-slate-900">
                R$ {data.kpis.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Pedidos</p>
              <h3 className="text-lg font-bold text-slate-900">{data.kpis.totalSolicitacoes}</h3>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Ticket size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Ticket Médio</p>
              <h3 className="text-lg font-bold text-slate-900">
                R$ {data.kpis.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Percent size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Aprovação</p>
              <h3 className="text-lg font-bold text-slate-900">{data.kpis.taxaAprovacao}%</h3>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-500 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg"><Clock size={20} /></div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Lead Time Médio</p>
              <h3 className="text-lg font-bold text-slate-900">{data.kpis.leadTime} dias</h3>
            </div>
          </div>
        </div>
      </div>

      {/* LINHA 1 DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-purple-500 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Evolução dos Gastos (R$)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.evolucaoMensal}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 11, fill: '#64748B' }} width={45} />
                <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Gastos']} />
                <Area type="monotone" dataKey="valor" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorValor)" dot={{ r: 3, fill: '#4F46E5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-purple-500 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-slate-800">Solicitações por Status</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.distribuicaoStatus} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {data.distribuicaoStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Pedidos']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-slate-800">{data.kpis.totalSolicitacoes}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {data.distribuicaoStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusColor(item.name) }}></span>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-800 font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LINHA 2: SAZONALIDADE E DEPARTAMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-purple-500 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Sazonalidade (Pedidos por Dia)</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sazonalidade}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} width={25} />
                <Tooltip formatter={(v) => [v, 'Qtd de Pedidos']} cursor={{fill: '#F1F5F9'}} />
                <Bar dataKey="qtd" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-purple-500 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Gastos por Departamento (R$)</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.custoPorDepartamento}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="depto" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} tick={{ fontSize: 11, fill: '#64748B' }} width={45} />
                <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Gasto']} cursor={{fill: '#F1F5F9'}} />
                <Bar dataKey="valor" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LINHA 3: MAPA DE CALOR */}
      <div className="w-full bg-white p-4 sm:p-6 rounded-xl border border-purple-500 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-800">
            Mapa de Calor: Volumetria
          </h2>
          {/* Aviso visual apenas para mobile indicando o scroll */}
          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded md:hidden">
            Deslize ↔
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed text-sm text-left min-w-[600px]">
            <thead>
              <tr>
                <th className="p-3 font-semibold text-slate-600 bg-slate-50 border-b border-slate-200 w-32 sm:w-48">
                  Departamento
                </th>
                {data.mapaCalor.categorias.map(cat => (
                  <th
                    key={cat}
                    className="p-3 font-semibold text-center text-slate-600 bg-slate-50 border-b border-slate-200"
                  >
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.mapaCalor.dados.map((linha, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-slate-700 bg-white border-r border-slate-100 truncate">
                    {linha.depto}
                  </td>
                  {data.mapaCalor.categorias.map(cat => {
                    const valor = linha[cat];
                    const intensidade =
                      maxHeatValue > 0 ? valor / maxHeatValue : 0;
                    return (
                      <td key={cat} className="p-1 text-center">
                        <div
                          className={`w-full h-10 flex items-center justify-center rounded transition-all font-semibold ${
                            valor > 0
                              ? 'text-indigo-900'
                              : 'text-slate-400'
                          }`}
                          style={{
                            backgroundColor:
                              valor > 0
                                ? `rgba(99, 102, 241, ${Math.max(
                                    0.1,
                                    intensidade
                                  )})`
                                : '#F8FAFC'
                          }}
                        >
                          {valor > 0 ? valor : '-'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {data.mapaCalor.dados.length === 0 && (
                <tr>
                  <td
                    colSpan={data.mapaCalor.categorias.length + 1}
                    className="p-6 text-center text-slate-400"
                  >
                    Não há dados cruzados suficientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}