import React, { useState } from 'react';

export default function NovaSolicitacaoModal({ aberto, onClose, onCriar, usuario }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Equipamentos de TI',
    departamento: usuario?.departamento || 'TI', 
    prioridade: 'MEDIA',
    valorEstimado: '',
  });

  if (!aberto) return null;

const handleSubmit = (e) => {
    e.preventDefault();

    const valorString = String(formData.valorEstimado || "0");
    const valorLimpo = valorString.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);

    onCriar({
      ...formData,
      valorEstimado: valorNumerico 
    });
    
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'Equipamentos de TI',
      departamento: '',
      prioridade: 'MEDIA',
      valorEstimado: '',
    });
    onClose();
  };
  
  const handleValorChange = (e) => {
    let valor = e.target.value;
    
    valor = valor.replace(/\D/g, "");
    
    if (valor) {
      valor = (Number(valor) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    setFormData({ ...formData, valorEstimado: valor });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Ajuste de padding para mobile */}
      <div className="bg-white rounded-2xl w-full max-w-lg p-4 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <select
                required
                name="departamento"
                value={formData.departamento} 
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Selecione um departamento...</option>
                <option value="RH">RH</option>
                <option value="TI">TI</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Comercial">Comercial</option>
                <option value="Operações">Operações</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Valor Estimado numérico (R$) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-500">R$</span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={formData.valorEstimado}
                  onChange={handleValorChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Botões ajustados para quebrarem de linha de forma elegante no celular */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors order-2 sm:order-1">
              Cancelar
            </button>
            <button type="submit" className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm order-1 sm:order-2">
              Criar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}