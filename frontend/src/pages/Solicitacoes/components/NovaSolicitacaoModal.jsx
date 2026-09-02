import React, { useState } from 'react';

export default function NovaSolicitacaoModal({ aberto, onClose, onCriar, usuario }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Equipamentos de TI',
    departamento: usuario?.departamento || 'TI', // Modificado para .departamento
    prioridade: 'MEDIA',
    valorEstimado: '',
  });

  if (!aberto) return null;

const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Limpa a formatação visual (remove pontos e troca a vírgula por ponto)
    // Usamos String() por segurança, para garantir que o replace não falhe
    const valorString = String(formData.valorEstimado || "0");
    const valorLimpo = valorString.replace(/\./g, '').replace(',', '.');
    const valorNumerico = parseFloat(valorLimpo);

    // 2. Envia os dados para a API
    onCriar({
      ...formData,
      valorEstimado: valorNumerico // Agora vai limpinho, ex: 1234.56
    });
    
    // 3. Reseta o formulário
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'Equipamentos de TI',
      departamento: '', // Deixei vazio para forçar o usuário a escolher naquele <select> novo
      prioridade: 'MEDIA',
      valorEstimado: '',
    });
    onClose();
  };
  
  const handleValorChange = (e) => {
    let valor = e.target.value;
    
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, "");
    
    // Formata para moeda (divide por 100 para criar os decimais)
    if (valor) {
      valor = (Number(valor) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    // Atualiza o estado (adapte "formData" para o nome do seu estado atual)
    setFormData({ ...formData, valorEstimado: valor });
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
              <select
                required
                name="departamento"
                value={formData.departamento} /* Ajuste caso sua variável de estado tenha outro nome */
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} /* Ajuste a função de mudança conforme seu arquivo */
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

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
              Criar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}