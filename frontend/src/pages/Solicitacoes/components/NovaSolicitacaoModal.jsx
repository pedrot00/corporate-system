import React from 'react';
import { X } from 'lucide-react';

export default function NovaSolicitacaoModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  // Função para simular o salvamento
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    
    // Como estamos no mock, vamos apenas inventar um ID e pegar alguns dados básicos
    const novaSolicitacao = {
      id: `#00${Math.floor(Math.random() * 1000)}`,
      titulo: e.target.titulo.value,
      departamento: e.target.departamento.value,
      solicitante: 'Admin Local', // Fixo por enquanto
      prioridade: e.target.prioridade.value,
      valor: parseFloat(e.target.valor.value),
      data: new Date().toLocaleDateString('pt-BR'),
      estado: 'PENDENTE',
    };

    onSave(novaSolicitacao);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">Nova Solicitação</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Item</label>
            <input name="titulo" required type="text" placeholder="Ex: Notebook Dell Inspiron" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select name="departamento" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500">
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Operações">Operações</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select name="categoria" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500">
                <option value="Equipamentos">Equipamentos</option>
                <option value="Software">Software</option>
                <option value="Mobiliário">Mobiliário</option>
                <option value="Serviços">Serviços</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select name="prioridade" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500">
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado (R$)</label>
              <input name="valor" required type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Justificativa / Descrição</label>
            <textarea name="descricao" required rows="3" placeholder="Explique a necessidade desta aquisição..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors">
              Salvar Solicitação
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}