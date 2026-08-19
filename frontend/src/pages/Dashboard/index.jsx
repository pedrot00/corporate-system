import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, ClipboardList, Ticket, Percent, 
  Calendar, Bell, MoreHorizontal, RefreshCw 
} from 'lucide-react';

// MOCK DE DADOS CONFORME RETORNO DA API
const mockDashboardData = {
  kpis: {
    custoTotal: 4250000,
    totalSolicitacoes: 128,
    ticketMedio: 33203.12,
    taxaAprovacao: 78.4
  },
  evolucaoMensal: [
    { mes: 'Jan', valor: 300000 },
    { mes: 'Fev', valor: 400000 },
    { mes: 'Mar', valor: 320000 },
    { mes: 'Abr', valor: 450000 },
    { mes: 'Mai', valor: 620000 },
    { mes: 'Jun', valor: 830000 },
    { mes: 'Jul', valor: 600000 },
    { mes: 'Ago', valor: 660000 },
    { mes: 'Set', valor: 910000 },
    { mes: 'Out', valor: 700000 },
    { mes: 'Nov', valor: 490000 },
    { mes: 'Dez', valor: 600000 },
  ],
  distribuicaoStatus: [
    { name: 'Aprovada', value: 45, count: 58, color: '#3B82F6' },
    { name: 'Pendente', value: 25, count: 32, color: '#F59E0B' },
    { name: 'Em Compra', value: 15, count: 19, color: '#8B5CF6' },
    { name: 'Rejeitada', value: 15, count: 19, color: '#EF4444' },
  ],
  custoPorDepartamento: [
    { depto: 'TI', valor: 1650000 },
    { depto: 'Financeiro', valor: 950000 },
    { depto: 'Operações', valor: 750000 },
    { depto: 'Marketing', valor: 500000 },
    { depto: 'RH', valor: 250000 },
    { depto: 'Administrativo', valor: 150000 },
  ],
  volumePorPrioridade: [
    { prioridade: 'Alta', qtd: 56, fill: '#EF4444' },
    { prioridade: 'Média', qtd: 42, fill: '#F59E0B' },
    { prioridade: 'Baixa', qtd: 30, fill: '#10B981' },
  ]
};

export default function Dashboard() {
  const [data, setData] = useState(mockDashboardData);

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            <Calendar size={14} className="text-slate-500" />
            <span>01/01/2026 - 31/12/2026</span>
          </div>
          <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Custo Total</p>
              <h3 className="text-lg font-bold text-slate-900">
                R$ {data.kpis.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium block">▲ 12,5% <span className="text-slate-400 font-normal">vs período anterior</span></span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList size={20} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total de Solicitações</p>
              <h3 className="text-lg font-bold text-slate-900">{data.kpis.totalSolicitacoes}</h3>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium block">▲ 8,2% <span className="text-slate-400 font-normal">vs período anterior</span></span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Ticket size={20} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Ticket Médio por Pedido</p>
              <h3 className="text-lg font-bold text-slate-900">
                R$ {data.kpis.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium block">▲ 3,6% <span className="text-slate-400 font-normal">vs período anterior</span></span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Percent size={20} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Taxa de Aprovação</p>
              <h3 className="text-lg font-bold text-slate-900">{data.kpis.taxaAprovacao}%</h3>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-medium block">▲ 5,7 p.p. <span className="text-slate-400 font-normal">vs período anterior</span></span>
        </div>

      </div>

      {/* LINHA 1 DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO 1: EVOLUÇÃO DOS GASTOS */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Evolução dos Gastos (R$)</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
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
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Gastos']} />
                <Area type="monotone" dataKey="valor" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorValor)" dot={{ r: 3, fill: '#4F46E5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: SOLICITAÇÕES POR STATUS */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-slate-800">Solicitações por Status</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.distribuicaoStatus} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {data.distribuicaoStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Proporção']} />
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
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-800 font-bold">{item.value}% ({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* LINHA 2 DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO 3: GASTOS POR DEPARTAMENTO */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Gastos por Departamento (R$)</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.custoPorDepartamento}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="depto" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Gasto Total']} />
                <Bar dataKey="valor" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 4: SOLICITAÇÕES POR PRIORIDADE */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Solicitações por Prioridade</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.volumePorPrioridade}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="prioridade" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="qtd" radius={[0, 4, 4, 0]}>
                  {data.volumePorPrioridade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RODAPÉ */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
        <RefreshCw size={12} />
        <span>Dados atualizados em 31/12/2026 às 10:30</span>
      </div>

    </div>
  );
}