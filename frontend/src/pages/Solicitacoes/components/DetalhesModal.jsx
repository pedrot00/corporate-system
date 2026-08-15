import React from 'react';
import { X } from 'lucide-react';

export default function DetalhesModal({ isOpen, onClose, solicitacao, onStatusChange }) {
  if (!isOpen || !solicitacao) return null;

  // Função intermediária para facilitar a chamada do botão
  const handleStatusUpdate = (novoStatus) => {
    onStatusChange(solicitacao.id, novoStatus);
    onClose(); // Fecha o modal após a ação
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">
            Detalhes da Solicitação {solicitacao.id}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Título</h3>
            <p className="text-slate-600">{solicitacao.titulo}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Valor</h3>
              <p className="text-slate-600">
                {solicitacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Status Atual</h3>
              <p className="text-slate-600 font-medium">{solicitacao.estado}</p>
            </div>
          </div>
        </div>

        {/* Rodapé com Botões de Ação Dinâmicos */}
        <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
          
          {/* Se a solicitação estiver PENDENTE, mostramos Aprovar e Rejeitar */}
          {solicitacao.estado === 'PENDENTE' && (
            <>
              <button 
                onClick={() => handleStatusUpdate('APROVADA')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Aprovar
              </button>
              <button 
                onClick={() => handleStatusUpdate('REJEITADA')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Rejeitar
              </button>
            </>
          )}

          {/* Se a solicitação estiver APROVADA, mostramos o botão de Iniciar Compra */}
          {solicitacao.estado === 'APROVADA' && (
            <button 
              onClick={() => handleStatusUpdate('EM_COMPRA')}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Iniciar Compra
            </button>
          )}

          {/* Se estiver em compra, finalizamos */}
          {solicitacao.estado === 'EM_COMPRA' && (
            <button 
              onClick={() => handleStatusUpdate('FINALIZADA')}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Finalizar Processo
            </button>
          )}

        </div>
      </div>
    </div>
  );
}