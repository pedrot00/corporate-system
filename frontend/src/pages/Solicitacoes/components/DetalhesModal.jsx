import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ShoppingCart, CheckCheck, History, AlertCircle, RefreshCw } from 'lucide-react';

export default function DetalhesModal({ item, onClose, onAtualizarEstado, usuario, apenasMinhas }) {
  const [observacao, setObservacao] = useState('');
  if (!item) return null;

  const podeAprovarRejeitar = ['PENDENTE', 'SOLICITACAO_REENVIADA'].includes(item.estado) && ['GESTOR', 'ADMIN'].includes(usuario?.papel);
  const podeIniciarCompra = item.estado === 'APROVADA' && ['GESTOR', 'ADMIN'].includes(usuario?.papel);
  const podeFinalizar = item.estado === 'EM_COMPRA' && ['GESTOR', 'ADMIN'].includes(usuario?.papel);
  const podeReenviar = item.estado === 'REJEITADA' && (apenasMinhas || item.usuarioSolicitante === usuario?.nome);

  const handleAcao = (novoEstado, defaultObs) => {
    onAtualizarEstado(item.id, novoEstado, observacao || defaultObs);
    setObservacao('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{item.titulo}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                item.prioridade === 'ALTA' ? 'bg-rose-100 text-rose-700' :
                item.prioridade === 'MEDIA' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.prioridade}
              </span>
            </div>
            <p className="text-xs text-slate-400">ID #{item.id} • Criado em {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            item.estado === 'APROVADA' ? 'bg-emerald-100 text-emerald-800' :
            item.estado === 'REJEITADA' ? 'bg-rose-100 text-rose-800' :
            item.estado === 'EM_COMPRA' ? 'bg-blue-100 text-blue-800' :
            item.estado === 'FINALIZADA' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {item.estado}
          </span>
        </div>

        {/* DETALHES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Solicitante</span>
            <p className="font-semibold text-slate-700">{item.usuarioSolicitante}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Departamento</span>
            <p className="font-semibold text-slate-700">{item.departamento}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Categoria</span>
            <p className="font-semibold text-slate-700">{item.categoria}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Valor Estimado</span>
            <p className="font-bold text-slate-800">{item.valorEstimado}</p>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500">Descrição</span>
          <p className="text-sm text-slate-700 mt-1 bg-white p-3 border border-slate-200 rounded-lg">{item.descricao}</p>
        </div>

        {/* TRANSIÇÕES DE ESTADO & OBSERVAÇÃO */}
        {(podeAprovarRejeitar || podeIniciarCompra || podeFinalizar || podeReenviar) && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-600">Observação da Ação (opcional)</label>
            <input
              type="text"
              placeholder="Ex: Aprovado conforme orçamento aprovado na reunião..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* HISTÓRICO DE AUDITORIA */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <History size={14} /> Histórico de Transições
          </span>
          <div className="max-h-36 overflow-y-auto space-y-2">
            {item.historico?.map((h) => (
              <div key={h.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{h.usuario}</span>
                  <span>{new Date(h.dataHora).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {h.estadoAnterior ? `${h.estadoAnterior} ➔ ${h.novoEstado}` : `Estado Inicial: ${h.novoEstado}`}
                </p>
                {h.observacao && <p className="text-slate-500 italic">"{h.observacao}"</p>}
              </div>
            ))}
          </div>
        </div>

        {/* AÇÕES DINÂMICAS CONFORME O ESTADO */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Fechar
          </button>

          {podeReenviar && (
            <button
              onClick={() => handleAcao('SOLICITACAO_REENVIADA', 'Solicitação reenviada pelo solicitante.')}
              className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw size={14} /> Reenviar Solicitação
            </button>
          )}

          {podeAprovarRejeitar && (
            <>
              <button
                onClick={() => handleAcao('REJEITADA', 'Solicitação rejeitada pelo gestor.')}
                className="px-4 py-2 text-sm font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors"
              >
                Rejeitar
              </button>
              <button
                onClick={() => handleAcao('APROVADA', 'Solicitação aprovada pelo gestor.')}
                className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Aprovar
              </button>
            </>
          )}

          {podeIniciarCompra && (
            <button
              onClick={() => handleAcao('EM_COMPRA', 'Processo de compra iniciado.')}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingCart size={14} /> Mover para "Em Compra"
            </button>
          )}

          {podeFinalizar && (
            <button
              onClick={() => handleAcao('FINALIZADA', 'Compra concluída e entregue.')}
              className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCheck size={14} /> Finalizar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}