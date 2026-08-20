import React, { useState } from 'react';

export default function NovaSolicitacaoModal({ aberto, onClose, onCriar, usuario }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Equipamentos de TI',
    departamento: usuario?.depto || 'TI',
    prioridade: 'MEDIA',
    valorEstimado: '',
  });

  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCriar({
      ...formData,
      valorEstimado: formData.valorEstimado.startsWith('R$') 
        ? formData.valorEstimado 
        : `R$ ${formData.valorEstimado}`,
      usuarioSolicitante: usuario?.nome || 'Usuário do Sistema',
    });
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'Equipamentos de TI',
      departamento: usuario?.depto || 'TI',
      prioridade: 'MEDIA',
      valorEstimado: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-800">Nova Solicitação de Compra</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título *</label>
            <input
              type="text"
              required
              placeholder="Ex: Monitor UltraWide 34''"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição Detalhada *</label>
            <textarea
              required
              rows={3}
              placeholder="Descreva a necessidade da compra e justificativa..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria *</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Equipamentos de TI">Equipamentos de TI</option>
                <option value="Licenças de Software">Licenças de Software</option>
                <option value="Material de Escritório">Material de Escritório</option>
                <option value="Serviços de Manutenção">Serviços de Manutenção</option>
                <option value="Mobiliário">Mobiliário</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Departamento *</label>
              <input
                type="text"
                required
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Prioridade *</label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Valor Estimado *</label>
              <input
                type="text"
                required
                placeholder="Ex: 2.500,00"
                value={formData.valorEstimado}
                onChange={(e) => setFormData({ ...formData, valorEstimado: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Criar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}