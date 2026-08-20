import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calendar, Filter, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const MOCK_DADOS_RELATORIO = [
  { categoria: 'Equipamentos de TI', quantidade: 14, total: 'R$ 38.500,00' },
  { categoria: 'Licenças de Software', quantidade: 8, total: 'R$ 12.200,00' },
  { categoria: 'Material de Escritório', quantidade: 22, total: 'R$ 4.350,00' },
  { categoria: 'Serviços de Manutenção', quantidade: 5, total: 'R$ 9.800,00' },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('30dias');
  const [depto, setDepto] = useState('TODOS');

  const handleExportar = (formato) => {
    alert(`Exportando relatório em formato ${formato.toUpperCase()}...`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios & Análises</h1>
          <p className="text-sm text-slate-500">Acompanhe métricas financeiras e volume de compras</p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => handleExportar('csv')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            CSV
          </button>
          <button
            onClick={() => handleExportar('pdf')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={16} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* PAINEL DE FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filtros:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <Calendar size={14} className="text-slate-400" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="ano">Ano Atual</option>
            </select>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <select
              value={depto}
              onChange={(e) => setDepto(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none"
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

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Aprovado</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 64.850,00</p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +12% em relação ao mês anterior
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Pedidos Concluídos</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingCart size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">49 chamados</p>
          <p className="text-xs text-slate-400">Atendidos dentro do prazo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Ticket Médio / Pedido</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 1.323,46</p>
          <p className="text-xs text-slate-400">Média por solicitação aprovada</p>
        </div>
      </div>

      {/* DETALHAMENTO POR CATEGORIA */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
          Gastos por Categoria
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4">Categoria</th>
              <th className="p-4">Qtd. Solicitações</th>
              <th className="p-4 text-right">Valor Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_DADOS_RELATORIO.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">{item.categoria}</td>
                <td className="p-4 text-slate-600">{item.quantidade} itens</td>
                <td className="p-4 text-right font-bold text-slate-800">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}